import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useContests } from "./useContests";

const mockUseAuth = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockGetUpcomingCodeforcesContests = vi.fn();
const mockGetMyReminderIds = vi.fn();
const mockAddContestReminder = vi.fn();
const mockRemoveContestReminder = vi.fn();

vi.mock("../services/contestService", () => ({
  getUpcomingCodeforcesContests: (...args) => mockGetUpcomingCodeforcesContests(...args),
  getMyReminderIds: (...args) => mockGetMyReminderIds(...args),
  addContestReminder: (...args) => mockAddContestReminder(...args),
  removeContestReminder: (...args) => mockRemoveContestReminder(...args),
}));

const CONTEST_A = { contestId: 1, name: "Round A", phase: "BEFORE", startTimeSeconds: 9999999999, durationSeconds: 7200 };

describe("useContests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockGetUpcomingCodeforcesContests.mockResolvedValue({ data: { data: [CONTEST_A] } });
    mockGetMyReminderIds.mockResolvedValue({ data: { data: [] } });
  });

  it("loads contests and reminder ids on mount", async () => {
    const { result } = renderHook(() => useContests());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.contests).toHaveLength(1);
    expect(result.current.contests[0].hasReminder).toBe(false);
  });

  it("optimistically marks a reminder as set immediately, before the request resolves", async () => {
    let resolveAdd;
    mockAddContestReminder.mockReturnValue(new Promise((resolve) => { resolveAdd = resolve; }));

    const { result } = renderHook(() => useContests());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.toggleReminder(1);
    });

    // Optimistic update should be visible immediately, without awaiting the request.
    expect(result.current.contests[0].hasReminder).toBe(true);

    await act(async () => {
      resolveAdd({ data: {} });
    });
  });

  it("rolls back the optimistic update if the add request fails", async () => {
    mockAddContestReminder.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useContests());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.toggleReminder(1)).rejects.toThrow();
    });

    expect(result.current.contests[0].hasReminder).toBe(false);
  });

  it("rolls back the optimistic removal if the remove request fails", async () => {
    mockGetMyReminderIds.mockResolvedValue({ data: { data: [1] } });
    mockRemoveContestReminder.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useContests());
    await waitFor(() => expect(result.current.contests[0]?.hasReminder).toBe(true));

    await act(async () => {
      await expect(result.current.toggleReminder(1)).rejects.toThrow();
    });

    expect(result.current.contests[0].hasReminder).toBe(true);
  });

  it("a slower earlier fetch cannot overwrite a newer, faster refetch's result (stale-response guard)", async () => {
    let resolveFirst;
    const firstCall = new Promise((resolve) => { resolveFirst = resolve; });
    const CONTEST_STALE = { ...CONTEST_A, contestId: 1, name: "Stale Data" };
    const CONTEST_FRESH = { ...CONTEST_A, contestId: 2, name: "Fresh Data" };

    mockGetUpcomingCodeforcesContests
      .mockImplementationOnce(() => firstCall) // initial mount fetch — never resolves until we say so
      .mockResolvedValueOnce({ data: { data: [CONTEST_FRESH] } }); // the refetch — resolves immediately

    const { result } = renderHook(() => useContests());

    // Fire a refetch before the initial (slower) request has resolved.
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.contests[0]?.name).toBe("Fresh Data");

    // Now let the original, slower request resolve late.
    await act(async () => {
      resolveFirst({ data: { data: [CONTEST_STALE] } });
    });

    // The stale response must NOT have overwritten the newer data.
    expect(result.current.contests[0]?.name).toBe("Fresh Data");
  });

  it("does not crash or warn when a fetch resolves after unmount (React 18 already no-ops post-unmount setState silently; the requestId guard's actual regression coverage is the stale-response race test above)", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    let resolveFetch;
    mockGetUpcomingCodeforcesContests.mockReturnValue(
      new Promise((resolve) => { resolveFetch = resolve; })
    );

    const { unmount } = renderHook(() => useContests());
    unmount();

    await act(async () => {
      resolveFetch({ data: { data: [CONTEST_A] } });
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
