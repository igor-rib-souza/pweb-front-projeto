import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import UserRoute from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRoute from "./PublicRoutes";
import NotFound from "@/pages/NotFound";
import MyRentals from "@/pages/client/MyRentals";
import Movies from "@/pages/client/Movies";
import MoviesAdmin from "@/pages/admin/Movies";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import Payments from "@/pages/admin/Payments";
import Categories from "@/pages/admin/Categories";
import Users from "@/pages/admin/Users";
import Rentals from "@/pages/admin/Rentals";

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
						path="/my-rentals" 
						element={
							<UserRoute>
								<MyRentals />
							</UserRoute>
						} 
					/>
				</Route>
				
        {/* ADMIN */}
				<Route element={<AdminLayout />}>
					<Route
						path="/movies"
						element={
							<AdminRoutes>
								<MoviesAdmin />
							</AdminRoutes>
						}
					/>
					<Route
						path="/categories"
						element={
							<AdminRoutes>
								<Categories />
							</AdminRoutes>
						}
					/>
					<Route
						path="/users"
						element={
							<AdminRoutes>
								<Users />
							</AdminRoutes>
						}
					/>
					<Route
						path="/rentals"
						element={
							<AdminRoutes>
								<Rentals />
							</AdminRoutes>
						}
					/>
					<Route
						path="/payments"
						element={
							<AdminRoutes>
								<Payments />
							</AdminRoutes>
						}
					/>
				</Route>

				<Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
