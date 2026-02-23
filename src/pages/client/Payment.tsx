import {
	Container,
	Typography,
	Button,
	TextField,
	MenuItem,
	Box,
	Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
	const { rentalId } = useParams();
	const navigate = useNavigate();

	const [amount, setAmount] = useState("");
	const [method, setMethod] = useState("PIX");
	const [error, setError] = useState<string | null>(null);

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const token = localStorage.getItem("token");

	const handlePayment = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/payments",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, 
					},
					body: JSON.stringify({
						userId: user.id,
						rentalId: Number(rentalId),
						amount: parseFloat(amount), 
						method,
						status: "PAID",
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Erro ao processar pagamento");
			}

			navigate("/my-rentals");
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<Container sx={{ mt: 6 }}>
			<Typography variant="h5">
				Pagamento
			</Typography>

			<Box mt={3}>
				<TextField
					label="Valor"
					type="number"
					fullWidth
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					inputProps={{
						step: "0.01",
						min: "0",
					}}
				/>

				<TextField
					select
					label="Método"
					fullWidth
					sx={{ mt: 2 }}
					value={method}
					onChange={(e) => setMethod(e.target.value)}
				>
					<MenuItem value="PIX">PIX</MenuItem>
					<MenuItem value="CREDIT_CARD">
						Cartão de Crédito
					</MenuItem>
					<MenuItem value="DEBIT_CARD">
						Cartão de Débito
					</MenuItem>
				</TextField>
			</Box>

			{error && <Alert severity="error">{error}</Alert>}

			<Button
				variant="contained"
				sx={{ mt: 3 }}
				onClick={handlePayment}
				disabled={!amount} 
			>
				Pagar
			</Button>
		</Container>
	);
}