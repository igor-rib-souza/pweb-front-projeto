import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	CircularProgress,
	Alert,
	Box,
	Button,
	CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

interface Movie {
	id: number;
	title: string;
	overview: string;
	posterPath: string;
	releaseDate: string;
}

export default function MovieDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [movie, setMovie] = useState<Movie | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMovie = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/movie/${id}`
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error("Erro ao buscar filme.");
				}

				setMovie(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchMovie();
	}, [id]);

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!movie) return null;

	return (
		<Container sx={{ mt: 6 }}>
			<Box display="flex" gap={4} flexWrap="wrap">
				<CardMedia
					component="img"
					image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
					sx={{ width: 300 }}
				/>

				<Box>
					<Typography variant="h4">{movie.title}</Typography>
					<Typography mt={2}>{movie.overview}</Typography>

					<Button
						variant="contained"
						sx={{ mt: 3 }}
						onClick={() =>
							navigate(`/rental/create/${movie.id}`)
						}
					>
						Alugar Filme
					</Button>
				</Box>
			</Box>
		</Container>
	);
}