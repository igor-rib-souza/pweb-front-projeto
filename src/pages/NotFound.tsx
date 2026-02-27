import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NotFound() {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleBack = () => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (user.role === "admin") {
			navigate("/dashboard");
		} else {
			navigate("/");
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "white",
				px: 2,
			}}
		>
			<Container maxWidth="sm">
				<Box
					sx={{
						backgroundColor: "#121212",
						borderRadius: 4,
						p: 6,
						textAlign: "center",
						boxShadow: "0 0 40px rgba(229, 9, 20, 0.2)",
						border: "1px solid #2a2a2a",
					}}
				>
					<ErrorOutlineIcon
						sx={{
							fontSize: 80,
							color: "#E50914",
							mb: 2,
						}}
					/>

					<Typography
						variant="h2"
						fontWeight="bold"
						sx={{
							background:
								"linear-gradient(45deg, #E50914, #ff5252)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						404
					</Typography>

					<Typography variant="h5" mt={2} fontWeight="bold">
						Opa! Você se perdeu no catálogo?
					</Typography>

					<Typography
						variant="body1"
						mt={2}
						sx={{ color: "#bbb" }}
					>
						A página que você está procurando não existe
						ou foi removida.
					</Typography>

					<Button
						variant="contained"
						startIcon={<ArrowBackIcon />}
						sx={{
							mt: 4,
							backgroundColor: "#E50914",
							fontWeight: "bold",
							px: 4,
							py: 1.5,
							borderRadius: 3,
							"&:hover": {
								backgroundColor: "#b20710",
							},
						}}
						onClick={handleBack}
					>
						Voltar para home
					</Button>
				</Box>
			</Container>
		</Box>
	);
}