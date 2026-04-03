export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function isLoggedIn() {
  return !!getToken() && !isTokenExpired();
}

export function getName() {
  return localStorage.getItem("name");
}

export function saveAuth(token, role, name) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (name) localStorage.setItem("name", name);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
}

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}
