let getAuthToken;
let logoutUser;

export function initializeAuthUtils({ get, refresh, logout }) {
  getAuthToken = get;
  logoutUser = logout;
  // Note: refresh token is not used - backend doesn't support it
}

export async function authenticatedFetch(url, options = {}) {
  let token = getAuthToken ? getAuthToken() : null;

  // Fallback for edge cases where context state is not yet hydrated.
  if (!token && typeof window !== "undefined") {
    token = window.localStorage.getItem("auth_access_token");
  }

  // Do not force navigation here; callers can decide how to handle auth failures.
  if (!token) {
    return new Response(JSON.stringify({ message: "Session expired. Please log in again." }), { status: 401 });
  }

  // Don't set Content-Type for FormData - let browser set it automatically with boundary
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // Only set Content-Type if not FormData
  if (!isFormData && !defaultHeaders["Content-Type"] && !defaultHeaders["content-type"]) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const defaultOptions = {
    ...options,
    headers: defaultHeaders,
  };

  // Just return the response - let components handle 401/errors
  const response = await fetch(url, defaultOptions);
  return response;
}
