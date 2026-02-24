import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Categories from "@/pages/client/Categories";
import MoviesByCategory from "@/pages/client/MoviesByCategory";
import Dashboard from "@/pages/admin/Dashboard";
import UserRoute from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PublicRoute from "./PublicRoutes";
import NotFound from "@/pages/NotFound";
import MovieDetails from "@/pages/client/MovieDetails";
import CreateRental from "@/pages/client/CreateRental";
import Payment from "@/pages/client/Payment";
import MyRentals from "@/pages/client/MyRentals";
import ClientLayout from "@/components/layout/ClientLayout";
import Movies from "@/pages/client/Movies";

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
				<Route element={<ClientLayout />}>
					<Route
						path="/"
						element={
							<UserRoute>
								<Movies />
							</UserRoute>
						}
						/>
					<Route
						path="/categories"
						element={
							<UserRoute>
								<Categories />
							</UserRoute>
						}
						/>
					<Route 
						path="/category/:id" 
						element={
							<UserRoute>
								<MoviesByCategory />
							</UserRoute>
						} 
						/>
					<Route 
						path="/movie/:id" 
						element={
							<UserRoute>
								<MovieDetails />
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
						path="/payment/:rentalId" 
						element={
							<UserRoute>
							<Payment />
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
