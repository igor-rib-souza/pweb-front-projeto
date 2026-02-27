import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleLogout = () => {
		localStorage.clear();
		window.location.href = "/login";
	};

	return (
		<>
			<AppBar 
			position="static"
			sx={{
				backgroundColor: "#141414",
				borderBottom: "1px solid #222",
			}}
			elevation={0}
			>
				<Toolbar>
					<Box
						component="img"
						src="/logo.svg"
						alt="Logo"
						sx={{ height: 40, mr: 2, cursor: "pointer" }}
						onClick={() => navigate("/movies")}
					/>
					<Typography
						variant="h6"
						sx={{ fontWeight: "bold", color: "#E40915", cursor: "pointer" }}
						onClick={() => navigate("movies")}
					>
						Sistema de Locadora
					</Typography>

					<Box sx={{ flexGrow: 1 }} />

					<Button
						onClick={() => navigate("/movies")}
						sx={{
							color: "white",
							textTransform: "none",
							"&:hover": {
								color: "#E50914",
							},
						}}
					>
						Filmes
					</Button>

					<Button
						onClick={() => navigate("/categories")}
						sx={{
							color: "white",
							textTransform: "none",
							"&:hover": {
								color: "#E50914",
							},
						}}
					>
						Categorias
					</Button>

					<Button
						onClick={() => navigate("/users")}
						sx={{
							color: "white",
							textTransform: "none",
							"&:hover": {
								color: "#E50914",
							},
						}}
					>
						Usuários
					</Button>

					<Button
						onClick={() => navigate("/rentals")}
						sx={{
							color: "white",
							textTransform: "none",
							"&:hover": {
								color: "#E50914",
							},
						}}
					>
						Aluguéis
					</Button>

					<Button
						onClick={() => navigate("/payments")}
						sx={{
							color: "white",
							textTransform: "none",
							"&:hover": {
								color: "#E50914",
							},
						}}
					>
						Pagamentos
					</Button>

					<Typography
						variant="body2"
						sx={{ mx: 2, color: "#aaa" }}
					>
						Olá, {user?.name}!
					</Typography>

					<Button
						onClick={handleLogout}
						sx={{
							color: "#E50914",
							textTransform: "none",
							fontWeight: "bold",
						}}
					>
						Logout
					</Button>
				</Toolbar>
			</AppBar>

			<Outlet />
		</>
	);
}