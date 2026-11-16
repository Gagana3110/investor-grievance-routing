// ---------------------------------------------------------------------------
// Backend integration point. This is the ONLY file that should talk to FastAPI.
//
// Planned endpoints (request/response schemas still to be agreed with the
// backend developer, so nothing here assumes a shape):
//   POST /complaints      -> starts a run
//   GET  /runs/{run_id}   -> run status and result
//
// Until they are wired up, both functions throw NotConnectedError so the UI
// can never show an invented result.
// ---------------------------------------------------------------------------

// Set VITE_API_BASE_URL in frontend/.env (for example http://localhost:8000).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class NotConnectedError extends Error {
  constructor(endpoint) {
    super(`${endpoint} is not connected yet.`);
    this.name = 'NotConnectedError';
  }
}

export async function submitComplaint(payload) {
  // TODO: fetch(`${API_BASE_URL}/complaints`, { method: 'POST', ... }) using the agreed schema.
  void payload;
  throw new NotConnectedError('POST /complaints');
}

export async function getRun(runId) {
  // TODO: fetch(`${API_BASE_URL}/runs/${runId}`) and return the agreed response.
  void runId;
  throw new NotConnectedError('GET /runs/{run_id}');
}
