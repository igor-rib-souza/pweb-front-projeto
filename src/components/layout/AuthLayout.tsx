import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
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
						sx={{ height: 40, mr: 2 }}
					/>
					<Typography
						variant="h6"
						sx={{ fontWeight: "bold", color: "#E40915" }}
					>
						Sistema de Locadora
					</Typography>
				</Toolbar>
			</AppBar>

			<Outlet />
		</>
	);
}
