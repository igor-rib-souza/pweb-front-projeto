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

interface Payment {
	id: number;
	userId: number;
	amount: string;
	method: string;
	status: string;
	rentalId: number;
	createdAt: string;
}

export default function Payments() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const token = localStorage.getItem("token");

	const fetchPayments = async () => {
		const response = await fetch("http://localhost:3000/payments", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Erro ao buscar pagamentos");

		const data = await response.json();
		setPayments(data);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				await fetchPayments();
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [token]);

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString("pt-BR");

	const formatCurrency = (value: string) =>
		Number(value).toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		});

	const getStatusChip = (status: string) => {
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

	const getMethodChip = (method: string) => {
		const colors: Record<string, string> = {
			PIX: "#1976d2",
			DEBIT_CARD: "#6a1b9a",
			CREDIT_CARD: "#00897b",
		};

		return (
			<Chip
				label={method}
				sx={{
					backgroundColor: colors[method] || "#424242",
					color: "white",
					fontWeight: "bold",
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
		<Container maxWidth="xl" sx={{ mt: 6 }}>
			<Typography variant="h4" sx={{ color: "white", mb: 4 }}>
				Pagamentos (Admin)
			</Typography>

			<TableContainer component={Paper} sx={{ backgroundColor: "#121212" }}>
				<Table>
					<TableHead>
						<TableRow>
							{[
								"ID",
								"Usuário",
								"Rental",
								"Valor",
								"Método",
								"Status",
								"Data",
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
						{payments.map((payment) => (
							<TableRow
								key={payment.id}
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
								<TableCell>{payment.id}</TableCell>
								<TableCell>{payment.userId}</TableCell>
								<TableCell>{payment.rentalId}</TableCell>
								<TableCell>
									{formatCurrency(payment.amount)}
								</TableCell>
								<TableCell>
									{getMethodChip(payment.method)}
								</TableCell>
								<TableCell>
									{getStatusChip(payment.status)}
								</TableCell>
								<TableCell>
									{formatDate(payment.createdAt)}
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