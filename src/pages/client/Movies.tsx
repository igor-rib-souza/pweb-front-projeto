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

export default function Movies() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/movie`
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
				Movies
			</Typography>

			{movies.length === 0 && (
				<Typography>Nenhum filme encontrado.</Typography>
			)}
			<Grid container spacing={3}>
				{movies.map((movie) => (
						<Grid
							key={movie.id}
							size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
						>
						<Box
							sx={{
								position: "relative",
								borderRadius: 3,
								overflow: "hidden",
								cursor: "pointer",
								transition: "0.3s",
								"&:hover": {
									transform: "scale(1.05)",
								},
								"&:hover .overlay": {
									opacity: 1,
								},
							}}
							onClick={() => navigate(`/movie/${movie.id}`)}
						>
							<CardMedia
								component="img"
								image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
								alt={movie.title}
								sx={{
									height: 380,
									objectFit: "cover",
								}}
							/>

							{/* Overlay estilo Netflix */}
							<Box
								className="overlay"
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									background:
										"linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
									display: "flex",
									flexDirection: "column",
									justifyContent: "flex-end",
									p: 0,
									opacity: 0,
									transition: "0.3s",
								}}
							>
								<Typography
									variant="subtitle1"
									sx={{
										marginLeft: 1,
										color: "white",
										fontWeight: "bold",
									}}
								>
									{movie.title}
								</Typography>

								<Button
									variant="contained"
									sx={{
										mt: 1,
										margin: 1,
										backgroundColor: "#E50914",
										borderRadius: 3,
										"&:hover": {
											backgroundColor: "#b20710",
										},
									}}
								>
									Ver detalhes
								</Button>
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}