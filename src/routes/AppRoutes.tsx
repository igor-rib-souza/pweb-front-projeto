import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Categories from "@/pages/client/Categories";
import Dashboard from "@/pages/admin/Dashboard";
import UserRoute from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRoute from "./PublicRoutes";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
				{/* PUBLIC */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>

				<Route
					path="/register"
					element={
						<PublicRoute>
							<Register />
						</PublicRoute>
					}
				/>

        {/* CLIENT */}
				<Route
					path="/"
					element={
						<UserRoute>
							<Categories />
						</UserRoute>
					}
				/>
				
        {/* ADMIN */}
				<Route
					path="/dashboard"
					element={
						<AdminRoutes>
							<Dashboard />
						</AdminRoutes>
					}
				/>

				<Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
