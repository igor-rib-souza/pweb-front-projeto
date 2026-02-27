import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/admin/Dashboard";
import UserRoute from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRoute from "./PublicRoutes";
import NotFound from "@/pages/NotFound";
import CreateRental from "@/pages/client/CreateRental";
import MyRentals from "@/pages/client/MyRentals";
import Movies from "@/pages/client/Movies";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
				<Route element={<AuthLayout />}>
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
				</Route>

        {/* CLIENT */}
				<Route element={<MainLayout />}>
					<Route
						path="/"
						element={
							<UserRoute>
								<Movies />
							</UserRoute>
						}
						/>
					<Route 
						path="/rental/create/:movieId" 
						element={
							<UserRoute>
								<CreateRental />
							</UserRoute>
						} 
						/>
					<Route 
						path="/my-rentals" 
						element={
							<UserRoute>
								<MyRentals />
							</UserRoute>
						} 
						/>
				</Route>
				
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
