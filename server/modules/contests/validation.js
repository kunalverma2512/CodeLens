import { z } from "zod";

/** Validate req.body against a Zod schema and call next() or return 400 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  req.body = result.data;
  next();
};

/** Validate req.params against a Zod schema and call next() or return 400 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  // Route params always arrive as strings; overwrite with the coerced,
  // validated values so downstream controllers get a real number.
  req.params = { ...req.params, ...result.data };
  next();
};

// z.coerce.number() alone uses JavaScript's Number() coercion, which
// accepts inputs that should never count as a valid id — e.g. Number(true)
// is 1, and Number([42]) is 42. Restricting the input to string | number
// FIRST (before coercion runs) rejects booleans, arrays, objects, etc.
// outright, while still allowing the numeric-string case route params
// always arrive as ("42" -> 42).
const contestIdValue = z
  .union([z.string(), z.number()])
  .pipe(z.coerce.number().int().positive());

export const addReminderSchema = z.object({
  contestId: contestIdValue,
});

// Same positive-integer contract as addReminderSchema, applied at the
// route boundary for :contestId params instead of a request body. Kept as
// a separate exported schema (built from the same underlying
// contestIdValue primitive) so the two remain independently evolvable if
// param- and body-level rules ever need to diverge (e.g. bounds specific
// to one context), without duplicating the coercion/type-guard logic.
export const contestIdParamSchema = z.object({
  contestId: contestIdValue,
});
