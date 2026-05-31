import api from "./api.js";

// ── Base URL for SSE (native fetch — axios doesn't support streaming) ──────────
// We derive it from the same VITE_API_BASE_URL env var used by axios.
const SSE_BASE = `${import.meta.env.VITE_API_BASE_URL}`;

// ─────────────────────────────────────────────────────────────────────────────
// Standard REST endpoints (use axios via the shared `api` instance)
// These automatically send credentials (cookies) via `withCredentials: true`
// configured in api.js.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/apex/conversations
 * Creates a new conversation and compiles fresh user context.
 * @returns {Promise<{ _id, title, pinned, createdAt, updatedAt }>}
 */
export const createConversation = () =>
  api.post("/ai/apex/conversations");

/**
 * GET /api/ai/apex/conversations
 * Lists all conversations for the sidebar.
 * @returns {Promise<Array<{ _id, title, pinned, updatedAt, lastMessagePreview, lastMessageRole }>>}
 */
export const listConversations = () =>
  api.get("/ai/apex/conversations");

/**
 * GET /api/ai/apex/conversations/:id
 * Loads a specific conversation's full message history.
 * @param {string} conversationId
 * @returns {Promise<{ _id, title, messages, pinned, createdAt, updatedAt }>}
 */
export const loadConversation = (conversationId) =>
  api.get(`/ai/apex/conversations/${conversationId}`);

/**
 * DELETE /api/ai/apex/conversations/:id
 * Soft-deletes a conversation.
 * @param {string} conversationId
 * @returns {Promise<{ deleted: true }>}
 */
export const deleteConversation = (conversationId) =>
  api.delete(`/ai/apex/conversations/${conversationId}`);

// ─────────────────────────────────────────────────────────────────────────────
// SSE streaming endpoint (native fetch — NOT axios)
//
// Why not axios?
//   Axios buffers the full response body before resolving. SSE requires
//   reading the response body as a ReadableStream incrementally.
//   Native fetch supports this via response.body.getReader().
//
// Credentials:
//   We pass `credentials: 'include'` so the browser sends the same
//   HttpOnly auth cookies that axios uses.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/apex/conversations/:id/message
 *
 * Sends a user message and streams APEX's response chunk-by-chunk.
 *
 * @param {string}   conversationId  - The conversation to send the message to
 * @param {string}   message         - The user's message text
 * @param {Function} onChunk         - Called with each text chunk as it arrives: (text: string) => void
 * @param {Function} onDone          - Called when stream completes: ({ title: string }) => void
 * @param {Function} onError         - Called on any error: (errorMessage: string) => void
 * @returns {Function}               - A cancel function: call it to abort the stream mid-flight
 *
 * @example
 *   const cancel = sendMessage(convId, "Hello", 
 *     (chunk) => setResponse(prev => prev + chunk),
 *     ({ title }) => setTitle(title),
 *     (err) => setError(err)
 *   );
 *   // To cancel mid-stream:
 *   cancel();
 */
export const sendMessage = (conversationId, message, onChunk, onDone, onError) => {
  const controller = new AbortController();

  const run = async () => {
    try {
      const response = await fetch(
        `${SSE_BASE}/ai/apex/conversations/${conversationId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",     // Send auth cookies
          signal: controller.signal,  // Allows cancellation
          body: JSON.stringify({ message }),
        }
      );

      // Handle non-2xx HTTP errors (e.g. 400, 403, 429, 500)
      // These come back as JSON, not as a stream
      if (!response.ok) {
        let errorMsg = `Request failed (${response.status})`;
        try {
          const errorBody = await response.json();
          errorMsg = errorBody.message || errorMsg;
        } catch {
          // Body wasn't JSON — use the default message
        }
        onError(errorMsg);
        return;
      }

      // Read the SSE stream incrementally
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the raw bytes and accumulate in buffer
        // (chunks may split across SSE event boundaries)
        buffer += decoder.decode(value, { stream: true });

        // Split on double-newline (SSE event delimiter)
        const events = buffer.split("\n\n");

        // The last element may be an incomplete event — keep it in buffer
        buffer = events.pop();

        for (const event of events) {
          const line = event.trim();
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6); // Strip "data: "
          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.error) {
              onError(parsed.error);
              return;
            }

            if (parsed.content) {
              onChunk(parsed.content);
            }

            if (parsed.done) {
              onDone({ title: parsed.title ?? null });
            }
          } catch {
            // Malformed JSON in stream — skip silently
            console.warn("[apexService] Failed to parse SSE chunk:", jsonStr);
          }
        }
      }
    } catch (err) {
      // AbortError is expected when cancel() is called — don't treat as error
      if (err.name === "AbortError") return;
      console.error("[apexService] Stream error:", err);
      onError("Connection lost. Please check your network and try again.");
    }
  };

  run();

  // Return a cancel function so the caller can abort mid-stream
  return () => controller.abort();
};
