import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user") || "{}");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
	};

	return (
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
					sx={{
						height: 40,
						cursor: "pointer",
						mr: 2,
					}}
					onClick={() => navigate("/")}
				/>

				<Typography
					variant="h6"
					sx={{
						flexGrow: 1,
						color: "#E50914",
						fontWeight: "bold",
					}}
				>
					Sistema de Locadora
				</Typography>

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
					Categories
				</Button>

				<Button
					onClick={() => navigate("/my-rentals")}
					sx={{
						color: "white",
						textTransform: "none",
						"&:hover": {
							color: "#E50914",
						},
					}}
				>
					My Rentals
				</Button>

				<Typography
					variant="body2"
					sx={{ mx: 2, color: "#aaa" }}
				>
					Hi, {user?.name}!
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
	);
}