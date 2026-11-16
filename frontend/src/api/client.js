export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function checkHealth() {
  return request('/health');
}

export function submitComplaint(payload) {
  return request('/v1/complaints', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getRun(runId) {
  return request(`/v1/runs/${encodeURIComponent(runId)}`);
}

export function submitFeedback(payload) {
  return request('/v1/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}