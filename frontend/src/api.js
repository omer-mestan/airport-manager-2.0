const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("Cannot reach the backend. Start Django on http://127.0.0.1:8000 and try again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function login(email, password) {
  return fetchJson("/api/auth/login/", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile(token) {
  return fetchJson("/api/auth/me/", {
    headers: authHeaders(token),
  });
}

export function getFlights() {
  return fetchJson("/api/flights/");
}

export function getAirports() {
  return fetchJson("/api/airports/");
}

export function getAirlines() {
  return fetchJson("/api/airlines/");
}

export function getAircraft() {
  return fetchJson("/api/aircraft/");
}

export function getAdminDashboard(token) {
  return fetchJson("/api/dashboard/admin/", {
    headers: authHeaders(token),
  });
}

export function getCrewDashboard(token) {
  return fetchJson("/api/dashboard/crew/", {
    headers: authHeaders(token),
  });
}

export function createFlight(token, payload) {
  return fetchJson("/api/flights/", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
}

export function updateFlight(token, flightId, payload) {
  return fetchJson(`/api/flights/${flightId}/`, {
    method: "PATCH",
    headers: {
      ...JSON_HEADERS,
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
}

export function deleteFlight(token, flightId) {
  return fetchJson(`/api/flights/${flightId}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
