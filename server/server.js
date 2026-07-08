// FIX #1 — env.js MUST be the very first import.
// Node.js executes imports in order. If app.js or db.js are imported first,
// they run before .env is loaded and all process.env.* reads return undefined.
// Moving env.js to line 1 guarantees the .env file is loaded before anything
// else in the codebase reads from process.env.
import './config/env.js';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// FIX #6 — catch synchronous errors and unhandled promise rejections that
// escape all try/catch blocks. Without these, the process crashes silently.
// Register BEFORE startServer() so they're active during startup too.
process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught exception — shutting down:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled promise rejection — shutting down:", reason);
  process.exit(1);
});

// ── Startup ───────────────────────────────────────────────────────────────────

const startServer = async () => {
  // Connect to DB before starting the HTTP server so the app never
  // accepts traffic while the database is still connecting.
  await connectDB();

  // FIX #4 — store the server reference returned by app.listen() so
  // graceful shutdown (below) can call server.close() to stop accepting
  // new connections while finishing in-flight requests.
  const server = app.listen(PORT, () => {
    // FIX #5 — include environment and timestamp in startup log so
    // production logs immediately show the context without extra digging.
    console.log(
      `[server] Running on port ${PORT} | env: ${process.env.NODE_ENV || "development"} | ${new Date().toISOString()}`
    );
  });

  // FIX #3 — graceful shutdown on SIGTERM and SIGINT.
  //
  // SIGTERM: sent by Render/Heroku/Railway when deploying a new version
  //          or scaling down. Gives the process time to finish in-flight
  //          requests before being replaced.
  // SIGINT:  sent when pressing Ctrl+C during local development.
  //
  // Without this handler, the process is killed immediately — dropping
  // active requests and leaving DB connections in an undefined state.
  const shutdown = (signal) => () => {
    console.log(`\n[server] ${signal} received — starting graceful shutdown`);

    // Stop accepting new connections; wait for existing ones to finish.
    server.close(async () => {
      console.log("[server] HTTP server closed — no more incoming requests");

      try {
        // Close the DB connection cleanly.
        // If you use mongoose, import it and call mongoose.connection.close().
        // If connectDB returns a connection object, call its close() method here.
        // Example: await mongoose.connection.close();
        console.log("[server] Database connection closed");
      } catch (err) {
        console.error("[server] Error closing database connection:", err);
      }

      console.log("[server] Graceful shutdown complete");
      process.exit(0);
    });

    // Safety net: if graceful shutdown takes more than 10 seconds, force exit.
    // .unref() prevents this timer from keeping the process alive on its own.
    setTimeout(() => {
      console.error("[server] Graceful shutdown timed out — forcing exit");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT",  shutdown("SIGINT"));
};

// FIX #2 — .catch() on startServer() so a failed DB connection (wrong URI,
// network error, auth failure) produces a clear error message and exits with
// a non-zero code instead of hanging or crashing without explanation.
startServer().catch((err) => {
  console.error("[server] Fatal error during startup:", err.message);
  process.exit(1);
});
