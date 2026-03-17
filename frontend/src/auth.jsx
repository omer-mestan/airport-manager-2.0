import { createContext, useContext, useEffect, useState } from "react";

import { getProfile, login } from "./api";

const TOKEN_KEY = "airport_manager_token";
const AuthContext = createContext(null);

export function defaultRouteForRole(role) {
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }
  if (role === "CREW_MEMBER") {
    return "/dashboard/crew";
  }
  return "/flights";
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [profile, setProfile] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!token) {
        setProfile(null);
        setIsLoadingSession(false);
        return;
      }

      try {
        setIsLoadingSession(true);
        const me = await getProfile(token);
        if (isActive) {
          setProfile(me);
          setAuthError("");
        }
      } catch (error) {
        if (isActive) {
          setToken("");
          setProfile(null);
          setAuthError(error.message);
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (isActive) {
          setIsLoadingSession(false);
        }
      }
    }

    loadProfile();
    return () => {
      isActive = false;
    };
  }, [token]);

  async function signIn(email, password) {
    setAuthError("");
    const data = await login(email, password);
    const me = await getProfile(data.access);
    localStorage.setItem(TOKEN_KEY, data.access);
    setToken(data.access);
    setProfile(me);
    return { ...data, profile: me };
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setProfile(null);
    setAuthError("");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        profile,
        isAuthenticated: Boolean(token),
        isLoadingSession,
        authError,
        signIn,
        signOut,
        defaultRouteForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
