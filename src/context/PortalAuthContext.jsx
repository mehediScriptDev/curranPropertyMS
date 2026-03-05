"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const TOKEN_KEY = (role) => `${role}_token`;
  const USER_KEY  = (role) => `${role}_user`;
  const ROLE_KEYS = ["admin", "landlord", "tenant"];

 
  useEffect(() => {
    try {
      for (const role of ROLE_KEYS) {
        const stored = localStorage.getItem(USER_KEY(role));
        const token  = localStorage.getItem(TOKEN_KEY(role));
        if (stored && token) {
          setUser(JSON.parse(stored));
          break;
        }
      }
    } catch {
      
    }
    setLoading(false);
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

 
      const payload      = data?.data ?? data ?? {};
      const userData     = payload?.user ?? {};
      const accessToken  = payload?.tokens?.accessToken  ?? data?.accessToken ?? data?.token ?? "";
      const refreshToken = payload?.tokens?.refreshToken ?? "";

     
      const role = (userData?.role ?? "").toLowerCase(); // "admin" | "landlord" | "tenant"
      localStorage.setItem(`${role}_token`,         accessToken);
      localStorage.setItem(`${role}_refresh_token`, refreshToken);
      localStorage.setItem(`${role}_user`,          JSON.stringify(userData));

      setUser(userData);
      return { ok: true, role };
    } catch {
      return { ok: false, error: "Network error. Please check your connection." };
    }
  };

  const logout = () => {
    const role = (user?.role ?? "").toLowerCase();
    if (role) {
      localStorage.removeItem(`${role}_token`);
      localStorage.removeItem(`${role}_refresh_token`);
      localStorage.removeItem(`${role}_user`);
    }
    setUser(null);
  };

  
  const getToken = () => {
    const role = (user?.role ?? "").toLowerCase();
    return role ? localStorage.getItem(`${role}_token`) ?? "" : "";
  };

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
