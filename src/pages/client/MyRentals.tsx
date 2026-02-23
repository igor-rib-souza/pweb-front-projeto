import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	List,
	ListItem,
	ListItemText,
	Alert,
	CircularProgress,
	Divider,
} from "@mui/material";

interface Rental {
	id: number;
	days: number;
	startDate: string | null;
	endDate: string | null;
	rentedAt: string;
	movie: {
		title: string;
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

		if (user?.id) {
			fetchRentals();
		} else {
			setError("Usuário não encontrado.");
			setLoading(false);
		}
	}, [user?.id, token]);

	const formatDateTime = (date: string | null) => {
		if (!date) return "—";

		const d = new Date(date);

		return `${d.toLocaleDateString("pt-BR")} at ${d.toLocaleTimeString("pt-BR")}`;
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;

	return (
		<Container sx={{ mt: 6 }}>
			<Typography variant="h4" gutterBottom>
				My Rentals
			</Typography>

			<List>
				{rentals.map((rental) => (
					<div key={rental.id}>
						<ListItem alignItems="flex-start">
							<ListItemText
								primary={rental.movie.title}
								secondary={
									<>
										<Typography variant="body2">
											Rental ID:{" "}
											{rental.id}
										</Typography>

										<Typography variant="body2">
											Payment Status:{" "}
											{rental.payment?.status || "—"}
										</Typography>

										<Typography variant="body2">
											Days: {rental.days}
										</Typography>

										<Typography variant="body2">
											Start Date:{" "}
											{formatDateTime(rental.startDate)}
										</Typography>

										<Typography variant="body2">
											End Date: {formatDateTime(rental.endDate)}
										</Typography>

										<Typography variant="body2">
											Rented At:{" "}
											{formatDateTime(rental.rentedAt)}
										</Typography>
									</>
								}
							/>
						</ListItem>
						<Divider />
					</div>
				))}
			</List>
		</Container>
	);
}