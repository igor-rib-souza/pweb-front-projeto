import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}