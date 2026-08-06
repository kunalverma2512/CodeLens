import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUpcomingCodeforcesContests,
  getMyReminderIds,
  addContestReminder,
  removeContestReminder,
} from "../services/contestService";

export const useContests = () => {
  const { isAuthenticated } = useAuth();

  const [contests, setContests] = useState([]);
  const [reminderIds, setReminderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Each fetch increments its own counter before firing; a response only
  // gets applied if the counter still matches when it resolves. This
  // guards against: (a) a slower earlier request resolving after a newer
  // one (e.g. rapid refetch/retry), and (b) any response resolving after
  // unmount (the cleanup effect below bumps both counters on unmount, so
  // no in-flight request's captured id can ever match again).
  const contestsRequestId = useRef(0);
  const remindersRequestId = useRef(0);

  const fetchContests = useCallback(async () => {
    const requestId = ++contestsRequestId.current;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUpcomingCodeforcesContests();
      if (requestId !== contestsRequestId.current) return; // superseded or unmounted
      setContests(data.data || []);
    } catch (err) {
      if (requestId !== contestsRequestId.current) return;
      setError(err.response?.data?.message || "Failed to load upcoming contests.");
    } finally {
      if (requestId === contestsRequestId.current) setLoading(false);
    }
  }, []);

  const fetchReminders = useCallback(async () => {
    const requestId = ++remindersRequestId.current;
    if (!isAuthenticated) {
      setReminderIds([]);
      return;
    }
    try {
      const { data } = await getMyReminderIds();
      if (requestId !== remindersRequestId.current) return;
      setReminderIds(data.data || []);
    } catch {
      // Non-fatal
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // On unmount, invalidate any still-in-flight requests so their eventual
  // resolution can never pass the requestId check above.
  useEffect(() => {
    return () => {
      contestsRequestId.current += 1;
      remindersRequestId.current += 1;
    };
  }, []);

  const toggleReminder = async (contestId) => {
    const hasReminder = reminderIds.includes(contestId);
    setReminderIds((prev) =>
      hasReminder ? prev.filter((id) => id !== contestId) : [...prev, contestId]
    );
    try {
      if (hasReminder) {
        await removeContestReminder(contestId);
      } else {
        await addContestReminder(contestId);
      }
    } catch (err) {
      setReminderIds((prev) =>
        hasReminder ? [...prev, contestId] : prev.filter((id) => id !== contestId)
      );
      throw err;
    }
  };

  const contestsWithMeta = useMemo(() => {
    return contests.map((contest) => {
      const startMs = contest.startTimeSeconds * 1000;
      const isTesting = ["PENDING_SYSTEM_TEST", "SYSTEM_TEST"].includes(contest.phase);
      return {
        ...contest,
        hasReminder: reminderIds.includes(contest.contestId),
        isRunning: contest.phase === "CODING" && now >= startMs,
        isTesting,
        msUntilStart: startMs - now,
      };
    });
  }, [contests, reminderIds, now]);

  return {
    contests: contestsWithMeta,
    loading,
    error,
    now,
    toggleReminder,
    refetch: fetchContests,
  };
};
