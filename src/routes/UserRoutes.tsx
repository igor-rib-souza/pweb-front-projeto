import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function UserRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}