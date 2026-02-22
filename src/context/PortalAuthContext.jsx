"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PortalAuthContext = createContext(null);

// Dummy users by role
const DUMMY_USERS = {
  admin: {
    id: "admin_001",
    name: "Admin",
    email: "admin@mccannandcurran.ie",
    phone: "+353 1 234 5678",
    address: "McCann & Curran HQ, Dublin, Ireland",
    ppsNumber: "1234567AB",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "admin",
  },
  landlord: {
    id: "landlord_001",
    name: "Joe Doyle",
    email: "joe.doyle@email.com",
    phone: "+353 86 123 4567",
    address: "124 Ashwood Crescent, Dublin, Ireland",
    ppsNumber: "5432109WA",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "landlord",
  },
  tenant: {
    id: "tenant_001",
    name: "Tenant User",
    email: "tenant@example.com",
    phone: "+353 87 654 3210",
    address: "Apt 12, Example St, Dublin, Ireland",
    ppsNumber: "9876543XY",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    role: "tenant",
  },
};

const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOlwiZHVtbXlfdXNlclwiLCJyb2xlIjoiZHluYW1pY1wiLCJpYXQiOjE3MDk5OTk5OTl9.dummy_signature";

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const role = localStorage.getItem("portal_role") || "landlord";
    if (token === DUMMY_TOKEN) {
      const selectedUser = DUMMY_USERS[role] || DUMMY_USERS.landlord;
      setUser(selectedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password, role = "landlord") => {
    // Accept any credentials that match pattern
    if (email && password.length >= 4) {
      const selectedUser = DUMMY_USERS[role] || DUMMY_USERS.landlord;
      localStorage.setItem("portal_token", DUMMY_TOKEN);
      localStorage.setItem("portal_role", role);
      setUser(selectedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("portal_token");
    localStorage.removeItem("portal_role");
    setUser(null);
  };

  return (
    <PortalAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
