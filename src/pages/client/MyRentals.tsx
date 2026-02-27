import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Alert,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Button,
	Box,
} from "@mui/material";

interface Rental {
	id: number;
	days: number;
	startDate: string | null;
	endDate: string | null;
	rentedAt: string;
	movie: {
		title: string;
		categoryId?: number;
	};
	payment?: {
		status: string;
		amount?: number;
	};
}

export default function MyRentals() {
	const [rentals, setRentals] = useState<Rental[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchRentals = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/rental/user/${user.id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Erro ao buscar aluguéis");
				}

				const data = await response.json();
				setRentals(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (user?.id) fetchRentals();
		else {
			setError("Usuário não encontrado.");
			setLoading(false);
		}
	}, [user?.id, token]);

	const formatDate = (date: string | null) => {
		if (!date) return "—";
		const d = new Date(date);
		return d.toLocaleDateString("pt-BR");
	};

	const getStatusChip = (status: string | undefined) => {
		if (!status) return <Chip label="—" />;

		const isPaid = status === "PAID";

		return (
			<Chip
				label={isPaid ? "Pago" : "Pendente"}
				sx={{
					backgroundColor: isPaid ? "#2e7d32" : "#f9a825",
					color: "white",
					fontWeight: "bold",
					borderRadius: "20px",
					px: 2,
				}}
			/>
		);
	};

	if (loading)
		return (
			<Box display="flex" justifyContent="center" mt={8}>
				<CircularProgress sx={{ color: "#E50914" }} />
			</Box>
		);

	if (error)
		return (
			<Container sx={{ mt: 6 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);

	return (
		<Container maxWidth="lg" sx={{ mt: 6 }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{
					color: "white",
					fontWeight: "500",
					mb: 4,
				}}
			>
				Meus Aluguéis
			</Typography>

			<TableContainer
				component={Paper}
				sx={{
					backgroundColor: "#121212",
					borderRadius: 3,
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							{[
								"ID",
								"Filme",
								"Categoria",
								"Data Início",
								"Data Fim",
								"Valor",
								"Status de Pagamento",
								"Ações",
							].map((header) => (
								<TableCell
									key={header}
									sx={{
										color: "#ccc",
										fontWeight: "bold",
										borderBottom: "1px solid #333",
										borderTop: "1px solid #333",
									}}
								>
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{rentals.map((rental) => {
							const status = rental.payment?.status;
							const amount =
								rental.payment?.amount ??
								rental.days * 9.9;

							return (
								<TableRow
									key={rental.id}
									sx={{
										"&:hover": {
											backgroundColor:
												"#1f1f1f",
										},
									}}
								>
									<TableCell sx={{ color: "white" }}>
										{rental.id}
									</TableCell>

									<TableCell sx={{ color: "white" }}>
										{rental.movie.title}
									</TableCell>

									<TableCell sx={{ color: "white" }}>
										{rental.movie.categoryId ??
											"—"}
									</TableCell>

									<TableCell sx={{ color: "white" }}>
										{formatDate(
											rental.startDate
										)}
									</TableCell>

									<TableCell sx={{ color: "white" }}>
										{formatDate(
											rental.endDate
										)}
									</TableCell>

									<TableCell sx={{ color: "white" }}>
										R$ {amount.toFixed(2)}
									</TableCell>

									<TableCell>
										{getStatusChip(status)}
									</TableCell>

									<TableCell>
										<Button
											size="small"
											sx={{
												color: "#E50914",
												fontWeight: "bold",
											}}
										>
											Ver
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}