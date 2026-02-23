import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	CircularProgress,
	Alert,
	Box,
	Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

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

export default function MoviesByCategory() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/movie/category/${id}`
				);

				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data?.message || "Erro ao buscar filmes."
					);
				}

				setMovies(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchMovies();
	}, [id]);

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" mt={8}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Container>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ mt: 6 }}>
			<Typography variant="h4" gutterBottom>
				Filmes da Categoria
			</Typography>

			{movies.length === 0 && (
				<Typography>Nenhum filme encontrado.</Typography>
			)}

				<Grid container spacing={4}>
					{movies.map((movie) => (
						<Grid
							key={movie.id}
							size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
						>
						<Card>
							<CardMedia
								component="img"
								height="350"
								image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
								alt={movie.title}
							/>

							<CardContent>
								<Typography variant="h6" gutterBottom>
									{movie.title}
								</Typography>

								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}
								>
									{movie.overview}
								</Typography>

								<Button
									variant="contained"
									fullWidth
									sx={{ mt: 2 }}
									onClick={() =>
										navigate(`/movie/${movie.id}`)
									}
								>
									Ver detalhes
								</Button>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}