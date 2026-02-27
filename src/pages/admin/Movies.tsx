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
	IconButton,
	Button,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";

interface Movie {
	id: number;
	tmdbId: number;
	title: string;
	overview: string;
	posterPath: string;
	releaseDate: string;
	categoryId: number;
	createdAt: string;
}

export default function Movies() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const token = localStorage.getItem("token");

	const fetchMovies = async () => {
		const response = await fetch("http://localhost:3000/movie", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Erro ao buscar filmes");

		const data = await response.json();
		setMovies(data);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				await fetchMovies();
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

	const truncateText = (text: string, maxLength = 20) => {
		if (!text) return "—";
		return text.length > maxLength
			? text.slice(0, maxLength) + "..."
			: text;
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
				Filmes
			</Typography>

			<Button
				variant="contained"
				sx={{
					mb: 3,
					backgroundColor: "#E50914",
					"&:hover": { backgroundColor: "#b20710" },
				}}
			>
				Novo Filme
			</Button>

			<TableContainer
				component={Paper}
				sx={{ backgroundColor: "#121212" }}
			>
				<Table>
					<TableHead>
						<TableRow>
							{[
								"ID",
								"Data de Criação",
								"Título",
								"Descrição",
								"TMDB ID",
								"Lançamento",
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
						{movies.map((movie) => (
							<TableRow
								key={movie.id}
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
								<TableCell>{movie.id}</TableCell>
								<TableCell>
									{formatDate(movie.createdAt)}
								</TableCell>
								<TableCell>{movie.title}</TableCell>
								<TableCell>
									{truncateText(movie.overview, 40)}
								</TableCell>
								<TableCell>{movie.tmdbId}</TableCell>
								<TableCell>
									{formatDate(movie.releaseDate)}
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