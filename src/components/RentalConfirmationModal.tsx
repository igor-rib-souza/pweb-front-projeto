import {
	Dialog,
	DialogContent,
	Typography,
	TextField,
	Button,
	Alert,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";

interface Movie {
	id: number;
	title: string;
}

interface Props {
	open: boolean;
	onClose: () => void;
	movie: Movie | null;
	onRentalCreated: (rentalId: number, amount: number) => void;
}

export default function RentalConfirmationModal({
	open,
	onClose,
	movie,
	onRentalCreated,
}: Props) {
	const [days, setDays] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const pricePerDay = 9.9;

	const totalPrice = useMemo(() => {
		return days * pricePerDay;
	}, [days]);

	useEffect(() => {
		if (open) {
			setDays(1);
			setError(null);
		}
	}, [open]);

	const handleCreateRental = async () => {
		try {
			setLoading(true);
			setError(null);

			const user = JSON.parse(localStorage.getItem("user") || "{}");
			const token = localStorage.getItem("token");

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
						movieId: movie?.id,
						days,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Erro ao criar aluguel");
			}

			// 🔥 ESSENCIAL
			onRentalCreated(data.id, totalPrice);

		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (!movie) return null;

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
					Confirmação de aluguel
				</Typography>

				<Typography textAlign="center" mb={2}>
					{movie.title}
				</Typography>

				<TextField
					label="Quantidade de dias"
					type="number"
					value={days}
					onChange={(e) =>
						setDays(Math.max(1, Number(e.target.value)))
					}
					fullWidth
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
				/>

				<Typography
					variant="h6"
					textAlign="center"
					mb={3}
					sx={{
						color: "#E50914",
						fontWeight: "bold",
					}}
				>
					Total: R$ {totalPrice.toFixed(2)}
				</Typography>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Button
					variant="contained"
					fullWidth
					onClick={handleCreateRental}
					disabled={loading}
					sx={{
						mt: 2,
						backgroundColor: "#E50914",
						"&:hover": {
							backgroundColor: "#b20710",
						},
					}}
				>
					{loading ? "Processando..." : "Confirmar aluguel"}
				</Button>
			</DialogContent>
		</Dialog>
	);
}