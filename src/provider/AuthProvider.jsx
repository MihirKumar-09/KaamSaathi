"use client";
import { useState } from "react";
import { AuthContext } from "@/context/AuthContext";
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (formData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Context-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data.user);

      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const registration = async (formData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Context-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setUser(data.user);

      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, registration, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
