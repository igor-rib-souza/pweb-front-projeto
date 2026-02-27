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

import RentalDetailsModal from "../../components/RentalDetailsModal";
import RentalConfirmationModal from "@/components/RentalConfirmationModal";
import PaymentConfirmationModal from "@/components/PaymentConfirmationModal";

interface Category {
	id: number;
	name: string;
}

interface Rental {
	id: number;
	days: number;
	startDate: string | null;
	endDate: string | null;
	rentedAt: string;
	movie: {
		id: number;
		title: string;
		overview: string;
		posterPath: string;
		categoryId?: number;
	};
	payment?: {
		status: string;
		amount?: number;
	};
}

export default function MyRentals() {
	const [rentals, setRentals] = useState<Rental[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
	const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

	const [detailsOpen, setDetailsOpen] = useState(false);
	const [openRentalModal, setOpenRentalModal] = useState(false);
	const [openPaymentModal, setOpenPaymentModal] = useState(false);

	const [createdRentalId, setCreatedRentalId] = useState<number | null>(null);
	const [createdRentalAmount, setCreatedRentalAmount] = useState<number>(0);

	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const token = localStorage.getItem("token");

	// 🔥 Função reutilizável
	const fetchRentals = async () => {
		const response = await fetch(
			`http://localhost:3000/rental/user/${user.id}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (!response.ok) throw new Error("Erro ao buscar aluguéis");

		const data = await response.json();
		setRentals(data);
	};

	const fetchCategories = async () => {
		const response = await fetch(
			"http://localhost:3000/category",
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (!response.ok) throw new Error("Erro ao buscar categorias");

		const data = await response.json();
		setCategories(data);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				await fetchRentals();
				await fetchCategories();
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (user?.id) fetchData();
		else {
			setError("Usuário não encontrado.");
			setLoading(false);
		}
	}, [user?.id, token]);

	const handleOpenDetails = (rental: Rental) => {
		setSelectedRental(rental);
		setDetailsOpen(true);
	};

	const handleCloseDetails = () => {
		setDetailsOpen(false);
		setSelectedRental(null);
	};

	const formatDate = (date: string | null) =>
		date ? new Date(date).toLocaleDateString("pt-BR") : "—";

	const getCategoryName = (categoryId?: number) => {
		if (!categoryId) return "—";
		const category = categories.find((c) => c.id === categoryId);
		return category?.name ?? "—";
	};

	const getStatusChip = (status?: string) => {
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
			<Typography variant="h4" sx={{ color: "white", mb: 4 }}>
				Meus Aluguéis
			</Typography>

			<TableContainer component={Paper} sx={{ backgroundColor: "#121212" }}>
				<Table>
					<TableHead>
						<TableRow>
							{[
								"ID",
								"Locado em",
								"Filme",
								"Categoria",
								"Data Início",
								"Data Fim",
								"Valor",
								"Status",
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
							const amount =
								rental.payment?.amount ?? rental.days * 9.9;

							return (
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
									<TableCell>
										{formatDate(rental.rentedAt)}
									</TableCell>
									<TableCell>{rental.movie.title}</TableCell>
									<TableCell>
										{getCategoryName(rental.movie.categoryId)}
									</TableCell>
									<TableCell>
										{formatDate(rental.startDate)}
									</TableCell>
									<TableCell>
										{formatDate(rental.endDate)}
									</TableCell>
									<TableCell>
										R$ {amount.toFixed(2)}
									</TableCell>
									<TableCell>
										{getStatusChip(rental.payment?.status)}
									</TableCell>
									<TableCell>
										<Button
											size="small"
											sx={{
												color: "#E50914",
												fontWeight: "bold",
											}}
											onClick={() => handleOpenDetails(rental)}
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

			{/* 🔥 Modal detalhes */}
			<RentalDetailsModal
				open={detailsOpen}
				onClose={handleCloseDetails}
				rental={selectedRental}
				onRent={() => {
					if (!selectedRental) return;

					setDetailsOpen(false);
					setSelectedMovie(selectedRental.movie);
					setOpenRentalModal(true);
				}}
			/>

			{/* 🔥 Confirmação aluguel */}
			<RentalConfirmationModal
				open={openRentalModal}
				onClose={() => setOpenRentalModal(false)}
				movie={selectedMovie}
				onRentalCreated={(rentalId, amount) => {
					setOpenRentalModal(false);
					setCreatedRentalId(rentalId);
					setCreatedRentalAmount(amount);
					setOpenPaymentModal(true);
				}}
			/>

			{/* 🔥 Confirmação pagamento */}
			<PaymentConfirmationModal
				open={openPaymentModal}
				onClose={async () => {
					setOpenPaymentModal(false);
					await fetchRentals(); // atualiza tabela
				}}
				rentalId={createdRentalId}
				amount={createdRentalAmount}
			/>
		</Container>
	);
}