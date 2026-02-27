import {
	Dialog,
	DialogContent,
	Typography,
	TextField,
	MenuItem,
	Button,
	Alert,
} from "@mui/material";
import { useState } from "react";

interface Props {
	open: boolean;
	onClose: () => void;
	rentalId: number | null;
	amount: number;
}

export default function PaymentConfirmationModal({
	open,
	onClose,
	rentalId,
	amount,
}: Props) {
	const [method, setMethod] = useState("PIX");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handlePayment = async () => {
		if (!rentalId) {
			setError("Rental inválido.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const user = JSON.parse(localStorage.getItem("user") || "{}");
			const token = localStorage.getItem("token");

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
						rentalId,
						amount,
						method,
						status: "PENDING",
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Erro ao processar pagamento");
			}

			onClose();
			alert("Pagamento criado com sucesso!");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					backgroundColor: "#141414",
					color: "white",
					borderRadius: 3,
					p: 2,
				},
			}}
		>
			<DialogContent>
				<Typography
					variant="h5"
					fontWeight="bold"
					textAlign="center"
					mb={3}
				>
					Confirmar pagamento
				</Typography>

				<Typography
					variant="h6"
					textAlign="center"
					mb={3}
					sx={{
						color: "#E50914",
						fontWeight: "bold",
					}}
				>
					Total: R$ {amount.toFixed(2)}
				</Typography>

				<TextField
					select
					label="Método de pagamento"
					fullWidth
					value={method}
					onChange={(e) => setMethod(e.target.value)}
					InputLabelProps={{
						sx: {
							color: "#aaa",
							"&.Mui-focused": {
								color: "#E50914",
							},
						},
					}}
					sx={{
						mb: 3,
						backgroundColor: "#1f1f1f",
						borderRadius: 2,
						"& .MuiOutlinedInput-root": {
							color: "white",
							"& fieldset": {
								borderColor: "#333",
							},
							"&:hover fieldset": {
								borderColor: "#E50914",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#E50914",
							},
						},
					}}
				>
					<MenuItem value="PIX">PIX</MenuItem>
					<MenuItem value="CREDIT_CARD">
						Cartão de Crédito
					</MenuItem>
					<MenuItem value="DEBIT_CARD">
						Cartão de Débito
					</MenuItem>
				</TextField>

				{error && (
					<Alert
						severity="error"
						sx={{
							mb: 2,
							backgroundColor: "#2a0f0f",
							color: "#ffb3b3",
						}}
					>
						{error}
					</Alert>
				)}

				<Button
					variant="contained"
					fullWidth
					disabled={loading}
					sx={{
						mt: 2,
						backgroundColor: "#E50914",
						borderRadius: 2,
						fontWeight: "bold",
						"&:hover": {
							backgroundColor: "#b20710",
						},
					}}
					onClick={handlePayment}
				>
					{loading ? "Processando..." : "Confirmar pagamento"}
				</Button>
			</DialogContent>
		</Dialog>
	);
}