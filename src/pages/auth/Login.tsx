import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
	Alert,
	CircularProgress,
	Link,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("http://localhost:3000/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Erro ao realizar login.");
			}

			login(data.token, data.user);
			navigate("/");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#141414",
			}}
		>
			<Container maxWidth="sm">
				<Paper
					elevation={10}
					sx={{
						p: 5,
						backgroundColor: "rgba(0,0,0,0.85)",
						color: "white",
						borderRadius: 3,
						backdropFilter: "blur(8px)",
					}}
				>
					<Box textAlign="center" mb={3}>
						<img
							src="/logo.svg"
							alt="Logo"
							style={{ width: 160 }}
						/>
					</Box>

					<Typography
						variant="h5"
						align="center"
						gutterBottom
						sx={{ fontWeight: "bold" }}
					>
						Login
					</Typography>

					{error && (
						<Alert
							severity="error"
							sx={{ mb: 2 }}
						>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Email"
							name="email"
							type="email"
							margin="normal"
							value={formData.email}
							onChange={handleChange}
							required
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{ style: { color: "white" } }}
						/>

						<TextField
							fullWidth
							label="Password"
							name="password"
							type="password"
							margin="normal"
							value={formData.password}
							onChange={handleChange}
							required
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{ style: { color: "white" } }}
						/>

						<Box textAlign="right" mt={1}>
							<Typography variant="body2">
								Não possui uma conta?{" "}
								<Link
									component={RouterLink}
									to="/register"
									sx={{
										color: "#E50914",
										textDecoration: "underline",
									}}
								>
									Cadastre-se
								</Link>
							</Typography>
						</Box>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							disabled={loading}
							sx={{
								mt: 3,
								backgroundColor: "#E50914",
								fontWeight: "bold",
								"&:hover": {
									backgroundColor: "#b20710",
								},
							}}
						>
							{loading ? (
								<CircularProgress size={24} sx={{ color: "white" }} />
							) : (
								"Log in"
							)}
						</Button>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
}