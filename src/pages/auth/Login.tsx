import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	Paper,
	Alert,
	CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
	email: string;
	password: string;
}

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth(); 

	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
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
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(
					data?.message || "Erro ao realizar login."
				);
			}

			login(data.token, data.user);

			if (data.user.role === "admin") {
				navigate("/dashboard");
			} else {
				navigate("/");
			}

		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
				<Typography variant="h4" align="center" gutterBottom>
					Login
				</Typography>

				{error && <Alert severity="error">{error}</Alert>}

				<Box component="form" onSubmit={handleSubmit} mt={2}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						type="email"
						margin="normal"
						value={formData.email}
						onChange={handleChange}
						required
					/>

					<TextField
						fullWidth
						label="Senha"
						name="password"
						type="password"
						margin="normal"
						value={formData.password}
						onChange={handleChange}
						required
					/>

					<Box mt={0} textAlign="right">
						<Typography variant="body2">
							Não tem conta?{" "}
							<Link component={RouterLink} to="/register">
								Registre aqui!
							</Link>
						</Typography>
					</Box>

					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{ mt: 3 }}
						disabled={loading}
					>
						{loading ? <CircularProgress size={24} /> : "Entrar"}
					</Button>

				</Box>
			</Paper>
		</Container>
	);
}