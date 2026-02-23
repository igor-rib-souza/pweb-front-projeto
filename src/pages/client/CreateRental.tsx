import {
	Container,
	Typography,
	Button,
	TextField,
	Box,
	Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreateRental() {
	const { movieId } = useParams();
	const navigate = useNavigate();

	const [days, setDays] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const token = localStorage.getItem("token");

	const handleCreateRental = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/rental",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userId: user.id,
						movieId: Number(movieId),
						days: Number(days),
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Erro ao criar aluguel");
			}

			navigate(`/payment/${data.id}`);
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<Container sx={{ mt: 6 }}>
			<Typography variant="h5">
				Confirmar aluguel
			</Typography>

			<Box mt={3}>
				<TextField
					label="Quantidade de dias"
					type="number"
					value={days}
					onChange={(e) => setDays(Number(e.target.value))}
					fullWidth
				/>
			</Box>

			{error && <Alert severity="error">{error}</Alert>}

			<Button
				variant="contained"
				sx={{ mt: 3 }}
				onClick={handleCreateRental}
			>
				Confirmar
			</Button>
		</Container>
	);
}