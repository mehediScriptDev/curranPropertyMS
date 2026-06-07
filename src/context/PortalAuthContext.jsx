"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { initializeAuthUtils } from "@/utils/authFetch";

const PortalAuthContext = createContext(null);

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token, skewSeconds = 30) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + skewSeconds;
}

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = "auth_access_token";
  const USER_ID_KEY = "auth_user_id";

  const clearAllAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  };

  // On mount, restore token and user from localStorage if valid
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUserId = localStorage.getItem(USER_ID_KEY);

      if (storedToken && storedUserId) {
        // Check if token is still valid
        if (!isTokenExpired(storedToken)) {
          const tokenPayload = decodeJwtPayload(storedToken);
          const role = (tokenPayload?.role ?? "").toLowerCase();

          setAccessToken(storedToken);
          setUser({ id: storedUserId, role });

          initializeAuthUtils({
            get: () => storedToken,
            refresh: () => null,
            logout: clearAllAuth,
          });
        } else {
          // Token expired, clear it
          clearAllAuth();
        }
      }
    } catch (error) {
      clearAllAuth();
    } finally {
      setLoading(false);
    }
  }, []);


  const login = async (email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detail = data?.errors?.length
          ? data.errors.map((e) => e.message).join(" · ")
          : data?.message || "Invalid credentials. Please try again.";
        return { ok: false, error: detail };
      }

      const payload = data?.data ?? data ?? {};
      const userData = payload?.user ?? {};
      const token = payload?.tokens?.accessToken ?? data?.accessToken ?? data?.token ?? "";

      const role = (userData?.role ?? "").toLowerCase();
      if (!["admin", "landlord", "tenant"].includes(role)) {
        return { ok: false, error: "Login succeeded but returned an invalid user role." };
      }

      if (!token) {
        return { ok: false, error: "Login succeeded but no access token was returned." };
      }

      if (isTokenExpired(token)) {
        return { ok: false, error: "Received an expired access token. Please try again." };
      }

      clearAllAuth();      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_ID_KEY, userData.id || "");
      setAccessToken(token);
      setUser({ id: userData.id, role });

      initializeAuthUtils({
        get: () => token,
        refresh: () => null, // No refresh available
        logout: logout,
      });

      return { ok: true, role };
    } catch {
      return { ok: false, error: "Network error. Please check your connection." };
    }
  };

  const logout = () => {
    clearAllAuth();
  };

  const getToken = () => {
    let token = accessToken;

    // If no token in state, try to restore from localStorage
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY);
    }

    if (!token || isTokenExpired(token)) {
      clearAllAuth();
      return null;
    }

    return token;
  };

  useEffect(() => {
    if (user && accessToken) {
      initializeAuthUtils({
        get: () => accessToken,
        refresh: () => null,
        logout: logout,
      });
    }
  }, [user, accessToken]);

  return (
    <PortalAuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
