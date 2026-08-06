import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ContestReminderBell from "./ContestReminderBell";

const mockUseAuth = vi.fn();
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseReminders = vi.fn();
vi.mock("../../context/ReminderContext", () => ({
  useReminders: () => mockUseReminders(),
}));

const renderBell = () =>
  render(
    <MemoryRouter>
      <ContestReminderBell />
    </MemoryRouter>
  );

const inHours = (h) => Date.now() + h * 60 * 60 * 1000;

describe("ContestReminderBell accessibility", () => {
  it("renders nothing when logged out", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    mockUseReminders.mockReturnValue({ reminders: [] });

    const { container } = renderBell();
    expect(container).toBeEmptyDOMElement();
  });

  it("has an accessible name (not just a visual title) with no due-soon reminders", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseReminders.mockReturnValue({ reminders: [] });

    renderBell();
    expect(screen.getByRole("link", { name: "Upcoming contest reminders" })).toBeInTheDocument();
  });

  it("includes the due-soon count in the accessible name when reminders are due within 24h", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseReminders.mockReturnValue({
      reminders: [
        { contestId: 1, startTimeSeconds: inHours(2) / 1000 },
        { contestId: 2, startTimeSeconds: inHours(10) / 1000 },
      ],
    });

    renderBell();
    expect(
      screen.getByRole("link", { name: "Upcoming contest reminders, 2 due within 24 hours" })
    ).toBeInTheDocument();
  });

  it("excludes contests further than 24h out and already-started contests from the count", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseReminders.mockReturnValue({
      reminders: [
        { contestId: 1, startTimeSeconds: inHours(2) / 1000 },    // due soon — counted
        { contestId: 2, startTimeSeconds: inHours(48) / 1000 },   // too far out — not counted
        { contestId: 3, startTimeSeconds: inHours(-1) / 1000 },   // already started — not counted
      ],
    });

    renderBell();
    expect(
      screen.getByRole("link", { name: "Upcoming contest reminders, 1 due within 24 hours" })
    ).toBeInTheDocument();
  });

  it("marks the decorative bell icon and count badge as aria-hidden, so they aren't double-announced alongside the aria-label", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseReminders.mockReturnValue({
      reminders: [{ contestId: 1, startTimeSeconds: inHours(1) / 1000 }],
    });

    const { container } = renderBell();
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBeGreaterThanOrEqual(2); // icon + badge
  });

  it("is reachable via keyboard (native <a>/Link, focusable by default, no positive tabIndex hacks)", async () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseReminders.mockReturnValue({ reminders: [] });

    const user = userEvent.setup();
    renderBell();

    await user.tab();
    expect(screen.getByRole("link", { name: "Upcoming contest reminders" })).toHaveFocus();
  });
});
