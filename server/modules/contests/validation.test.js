import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { addReminderSchema, contestIdParamSchema, validateParams } from "./validation.js";

// Both schemas currently enforce the identical positive-integer contract,
// so we test them together via a table — this also documents that they're
// expected to accept/reject the exact same set of inputs.
const schemas = {
  addReminderSchema,
  contestIdParamSchema,
};

describe("contest reminder id validation contract", () => {
  for (const [schemaName, schema] of Object.entries(schemas)) {
    describe(schemaName, () => {
      test("accepts a valid positive integer", () => {
        const result = schema.safeParse({ contestId: 2094 });
        assert.equal(result.success, true);
        assert.equal(result.data.contestId, 2094);
      });

      test("accepts a valid positive integer given as a string (route params arrive as strings)", () => {
        const result = schema.safeParse({ contestId: "2094" });
        assert.equal(result.success, true);
        assert.equal(result.data.contestId, 2094);
        assert.equal(typeof result.data.contestId, "number");
      });

      test("rejects zero", () => {
        const result = schema.safeParse({ contestId: 0 });
        assert.equal(result.success, false);
      });

      test("rejects negative numbers", () => {
        const result = schema.safeParse({ contestId: -5 });
        assert.equal(result.success, false);
      });

      test("rejects decimals", () => {
        const result = schema.safeParse({ contestId: 12.5 });
        assert.equal(result.success, false);
      });

      test("rejects non-numeric strings", () => {
        const result = schema.safeParse({ contestId: "abc" });
        assert.equal(result.success, false);
      });

      test("rejects permissive-looking strings like '12abc' (parseInt would have silently accepted this as 12)", () => {
        const result = schema.safeParse({ contestId: "12abc" });
        assert.equal(result.success, false);
      });

      test("rejects a missing contestId", () => {
        const result = schema.safeParse({});
        assert.equal(result.success, false);
      });

      test("rejects an empty string", () => {
        const result = schema.safeParse({ contestId: "" });
        assert.equal(result.success, false);
      });

      test("rejects a boolean (JS Number(true) === 1 would otherwise silently pass)", () => {
        const result = schema.safeParse({ contestId: true });
        assert.equal(result.success, false);
      });

      test("rejects an array (JS Number([42]) === 42 would otherwise silently pass)", () => {
        const result = schema.safeParse({ contestId: [42] });
        assert.equal(result.success, false);
      });
    });
  }
});

describe("validateParams middleware", () => {
  const makeMockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (body) => { res.body = body; return res; };
    return res;
  };

  test("returns 400 and does not call next for an invalid contestId param", () => {
    const middleware = validateParams(contestIdParamSchema);
    const req = { params: { contestId: "12abc" } };
    const res = makeMockRes();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    middleware(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  });

  test("calls next and converts a valid string contestId param to a number", () => {
    const middleware = validateParams(contestIdParamSchema);
    const req = { params: { contestId: "2094" } };
    const res = makeMockRes();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    middleware(req, res, next);

    assert.equal(nextCalled, true);
    assert.equal(req.params.contestId, 2094);
    assert.equal(typeof req.params.contestId, "number");
  });

  test("rejects a boolean contestId, which Number()-based coercion alone would have accepted as 1", () => {
    const middleware = validateParams(contestIdParamSchema);
    const req = { params: { contestId: true } };
    const res = makeMockRes();
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    middleware(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
  });
});
