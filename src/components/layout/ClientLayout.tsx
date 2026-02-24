import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

export default function ClientLayout() {
	return (
		<>
			<Navbar />
			<Box
				sx={{
					mt: 4,
					px: 4,
					minHeight: "100vh",
					backgroundColor: "#141414",
				}}
			>
				<Outlet />
			</Box>
		</>
	);
}