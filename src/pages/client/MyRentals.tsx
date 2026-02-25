import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Alert,
	CircularProgress,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Chip,
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
		posterPath: string;
	};
	payment?: {
		status: string;
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

	const formatDateTime = (date: string | null) => {
		if (!date) return "—";
		const d = new Date(date);
		return `${d.toLocaleDateString("pt-BR")} at ${d.toLocaleTimeString("pt-BR")}`;
	};

	if (loading) return <CircularProgress sx={{ color: "#E50914" }} />;
	if (error) return <Alert severity="error">{error}</Alert>;

	return (
		<Container sx={{ mt: 6 }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{ color: "#E50914", fontWeight: "bold" }}
			>
				Meus Aluguéis
			</Typography>

			<Grid container spacing={4}>
				{rentals.map((rental) => {
					const status = rental.payment?.status || "—";
					const isPaid = status === "PAID";

					return (
						<Grid
							key={rental.id}
							size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
						>
							<Card
								sx={{
									backgroundColor: "#1F1F1F",
									color: "white",
									borderRadius: 3,
									transition: "0.3s",
									"&:hover": {
										transform: "scale(1.03)",
										boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
									},
								}}
							>
								<CardMedia
									component="img"
									height="300"
									image={`https://image.tmdb.org/t/p/w500${rental.movie.posterPath}`}
									alt={rental.movie.title}
								/>

								<CardContent>
									<Typography
										variant="h6"
										sx={{ fontWeight: "bold" }}
									>
										{rental.movie.title}
									</Typography>

									<Box sx={{ my: 1 }}>
										<Chip
											label={status}
											sx={{
												backgroundColor: isPaid
													? "#2e7d32"
													: "#f9a825",
												color: "white",
												fontWeight: "bold",
											}}
										/>
									</Box>

									<Typography variant="body2">
										ID: {rental.id}
									</Typography>

									<Typography variant="body2">
										Dias: {rental.days}
									</Typography>

									<Typography variant="body2">
										Data Inicial:{" "}
										{formatDateTime(
											rental.startDate
										)}
									</Typography>

									<Typography variant="body2">
										Data Final:{" "}
										{formatDateTime(
											rental.endDate
										)}
									</Typography>

									<Typography variant="body2">
										Data de Locação:{" "}
										{formatDateTime(
											rental.rentedAt
										)}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
}