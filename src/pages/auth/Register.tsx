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

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
	name: "",
	email: "",
	password: "",
	cpf: "",
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
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        role: "user",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao cadastrar usuário.");
    }

    navigate("/login");
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
		  Criar Conta
		</Typography>

		{error && <Alert severity="error">{error}</Alert>}

		<Box component="form" onSubmit={handleSubmit} mt={2}>
		  <TextField
			fullWidth
			label="Nome"
			name="name"
			margin="normal"
			value={formData.name}
			onChange={handleChange}
			required
		  />

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
			label="CPF"
			name="cpf"
			margin="normal"
			value={formData.cpf}
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
					Já possui conta?{" "}
					<Link component={RouterLink} to="/login">
						Faça seu login aqui.
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
			{loading ? <CircularProgress size={24} /> : "Cadastrar"}
		  </Button>

		</Box>
	  </Paper>
	</Container>
  );
}