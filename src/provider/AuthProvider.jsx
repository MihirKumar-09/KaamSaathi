"use client";
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        } else {
          setUser(null);
          return null;
        }
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to load current user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (formData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data?.message || "Invalid credentials",
        };
      }

      if (data.user) {
        setUser(data.user);
      }

      return data;
    } catch (err) {
      return {
        success: false,
        message: err.message || "Something went wrong during login",
      };
    }
  };

  const registration = async (formData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data?.message || "Registration failed",
        };
      }
      if (data.user) {
        setUser(data.user);
      }

      return data;
    } catch (err) {
      return {
        success: false,
        message: err.message || "Something went wrong during registration",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
      router.refresh();
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      router.push("/login");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        registration,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

