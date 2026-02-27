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
	Box,
	Chip,
	IconButton,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";

interface Rental {
	id: number;
	userId: number;
	movieId: number;
	startDate: string | null;
	endDate: string | null;
	rentedAt: string;
	extended: boolean;
	days: number;
	movie: {
		title: string;
	};
	payment?: {
		status: string;
	};
}

export default function Rentals() {
	const [rentals, setRentals] = useState<Rental[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const token = localStorage.getItem("token");

	const fetchRentals = async () => {
		const response = await fetch("http://localhost:3000/rental", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Erro ao buscar aluguéis");

		const data = await response.json();
		setRentals(data);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				await fetchRentals();
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [token]);

	const formatDate = (date: string | null) =>
		date ? new Date(date).toLocaleDateString("pt-BR") : "—";

	const getPaymentChip = (status?: string) => {
		if (!status)
			return (
				<Chip
					label="Sem Pagamento"
					sx={{
						backgroundColor: "#616161",
						color: "white",
						fontWeight: "bold",
					}}
				/>
			);

		const isPaid = status === "PAID";

		return (
			<Chip
				label={isPaid ? "Pago" : "Pendente"}
				sx={{
					backgroundColor: isPaid ? "#2e7d32" : "#f9a825",
					color: "white",
					fontWeight: "bold",
				}}
			/>
		);
	};

	const getExtendedChip = (extended: boolean) => (
		<Chip
			label={extended ? "Sim" : "Não"}
			sx={{
				backgroundColor: extended ? "#1976d2" : "#424242",
				color: "white",
				fontWeight: "bold",
			}}
		/>
	);

	const calculateAmount = (days: number) => {
		const pricePerDay = 9.9;
		return (days * pricePerDay).toFixed(2);
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
		<Container maxWidth="xl" sx={{ mt: 6 }}>
			<Typography variant="h4" sx={{ color: "white", mb: 4 }}>
				Aluguéis (Admin)
			</Typography>

			<TableContainer component={Paper} sx={{ backgroundColor: "#121212" }}>
				<Table>
					<TableHead>
						<TableRow>
							{[
								"ID",
								"Usuário",
								"Filme",
								"Dias",
								"Locado em",
								"Início",
								"Fim",
								"Estendido",
								"Pagamento",
								"Valor (R$)",
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
						{rentals.map((rental) => (
							<TableRow
								key={rental.id}
								sx={{
									"& td": {
										color: "white",
										borderBottom: "1px solid #333",
									},
									"&:hover": {
										backgroundColor: "#1f1f1f",
									},
								}}
							>
								<TableCell>{rental.id}</TableCell>
								<TableCell>{rental.userId}</TableCell>
								<TableCell>{rental.movie.title}</TableCell>
								<TableCell>{rental.days}</TableCell>
								<TableCell>
									{formatDate(rental.rentedAt)}
								</TableCell>
								<TableCell>
									{formatDate(rental.startDate)}
								</TableCell>
								<TableCell>
									{formatDate(rental.endDate)}
								</TableCell>
								<TableCell>
									{getExtendedChip(rental.extended)}
								</TableCell>
								<TableCell>
									{getPaymentChip(rental.payment?.status)}
								</TableCell>
								<TableCell>
									{calculateAmount(rental.days)}
								</TableCell>
								<TableCell>
									<IconButton
										sx={{
											color: "white",
											"&:hover": {
												color: "#E50914",
											},
										}}
									>
										<EditDocumentIcon />
									</IconButton>

									<IconButton
										sx={{
											color: "white",
											"&:hover": {
												color: "#E50914",
											},
										}}
									>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}