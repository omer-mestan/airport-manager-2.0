const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || data?.message || "Request failed";
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getFlights() {
  return fetchJson("/api/flights/");
}

export function getAdminDashboard(token) {
  return fetchJson("/api/dashboard/admin/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getCrewDashboard(token) {
  return fetchJson("/api/dashboard/crew/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
