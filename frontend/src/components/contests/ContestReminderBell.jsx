import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useReminders } from "../../context/ReminderContext";

const DUE_SOON_WINDOW_MS = 24 * 60 * 60 * 1000; // badge counts contests starting in <24h
const NOW_REFRESH_INTERVAL_MS = 60_000; // due-soon badge only needs minute-level freshness

export default function ContestReminderBell() {
  const { isAuthenticated } = useAuth();
  const { reminders } = useReminders();

  // Date.now() is an impure call — it can't be invoked directly in the
  // render body (react-hooks/purity). Reading it once via useState's lazy
  // initializer, then refreshing on an interval, matches the same pattern
  // already used for "now" elsewhere in this codebase (see useContests.js).
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), NOW_REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // All hooks above must run unconditionally before this early return.
  if (!isAuthenticated) return null;

  const dueSoonCount = reminders.filter((c) => {
    const msUntilStart = c.startTimeSeconds * 1000 - now;
    return msUntilStart > 0 && msUntilStart < DUE_SOON_WINDOW_MS;
  }).length;

  const accessibleLabel =
    dueSoonCount > 0
      ? `Upcoming contest reminders, ${dueSoonCount} due within 24 hours`
      : "Upcoming contest reminders";

  return (
    <Link
      to="/contests/codeforces"
      aria-label={accessibleLabel}
      title="Upcoming contest reminders"
      className="relative flex items-center justify-center w-8 h-8 text-zinc-500 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-150"
    >
      <Bell size={18} strokeWidth={2} aria-hidden="true" />
      {dueSoonCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] font-bold rounded-full leading-none"
        >
          {dueSoonCount > 9 ? "9+" : dueSoonCount}
        </span>
      )}
    </Link>
  );
}
