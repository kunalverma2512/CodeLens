import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContestCountdown from "./ContestCountdown";

describe("ContestCountdown", () => {
  it("shows 'Live Now' when isRunning is true", () => {
    render(<ContestCountdown msUntilStart={-1000} isRunning isTesting={false} />);
    expect(screen.getByText("Live Now")).toBeInTheDocument();
  });

  it("shows 'System Testing' when isTesting is true and not running", () => {
    render(<ContestCountdown msUntilStart={-1000} isRunning={false} isTesting />);
    expect(screen.getByText("System Testing")).toBeInTheDocument();
  });

  it("prioritizes 'Live Now' over 'System Testing' if both were somehow true", () => {
    render(<ContestCountdown msUntilStart={-1000} isRunning isTesting />);
    expect(screen.getByText("Live Now")).toBeInTheDocument();
    expect(screen.queryByText("System Testing")).not.toBeInTheDocument();
  });

  it("shows 'Ended' when msUntilStart is <= 0 and not running or testing", () => {
    render(<ContestCountdown msUntilStart={0} isRunning={false} isTesting={false} />);
    expect(screen.getByText("Ended")).toBeInTheDocument();
  });

  it("shows an hh:mm:ss countdown for an upcoming contest under a day away", () => {
    const twoHours = 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 5 * 1000; // 2h 30m 5s
    render(<ContestCountdown msUntilStart={twoHours} isRunning={false} isTesting={false} />);
    expect(screen.getByText("02:30:05")).toBeInTheDocument();
  });

  it("prefixes with 'Nd' for a multi-day countdown", () => {
    const threeDays = 3 * 86400 * 1000 + 1 * 60 * 60 * 1000; // 3d 1h 0m 0s
    render(<ContestCountdown msUntilStart={threeDays} isRunning={false} isTesting={false} />);
    expect(screen.getByText(/3d/)).toBeInTheDocument();
    expect(screen.getByText(/01:00:00/)).toBeInTheDocument();
  });
});
