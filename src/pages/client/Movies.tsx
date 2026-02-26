import { useEffect, useState, useMemo } from "react";
import {
	Container,
	Typography,
	Grid,
	CardMedia,
	CircularProgress,
	Alert,
	Box,
	Button,
	TextField,
	MenuItem,
	InputAdornment,
	Dialog,
	DialogContent,
	IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Movie {
	id: number;
	title: string;
	overview: string;
	posterPath: string;
	categoryId: number;
}

interface Category {
	id: number;
	name: string;
}

export default function Movies() {
	const navigate = useNavigate();

	const [movies, setMovies] = useState<Movie[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [openModal, setOpenModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [moviesRes, categoriesRes] = await Promise.all([
					fetch("http://localhost:3000/movie"),
					fetch("http://localhost:3000/category"),
				]);

				const moviesData = await moviesRes.json();
				const categoriesData = await categoriesRes.json();

				setMovies(moviesData);
				setCategories(categoriesData);
			} catch (err: any) {
				setError("Erro ao carregar dados.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredMovies = useMemo(() => {
		return movies.filter((movie) => {
			const matchesSearch = movie.title
				.toLowerCase()
				.includes(search.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" ||
				movie.categoryId === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [movies, search, selectedCategory]);

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
		<>
			<Dialog
				open={openModal}
				onClose={() => setOpenModal(false)}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: {
						backgroundColor: "#141414",
						color: "white",
						borderRadius: 3,
					},
				}}
			>
				{selectedMovie && (
					<DialogContent>
						<Box display="flex" gap={4} flexWrap="wrap">
							
							{/* 🎬 Banner */}
							<Box flex={1} minWidth={250}>
								<CardMedia
									component="img"
									image={`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
									alt={selectedMovie.title}
									sx={{ borderRadius: 2 }}
								/>
							</Box>

							{/* 📄 Informações */}
							<Box flex={1} minWidth={250} display="flex" flexDirection="column" justifyContent="space-between">
								
								<Box>
									<Typography variant="h5" fontWeight="bold" mb={2}>
										{selectedMovie.title}
									</Typography>

									<Typography variant="body1" mb={2}>
										{selectedMovie.overview}
									</Typography>

									<Typography variant="h6" color="#E50914">
										R$ 9,90 / dia
									</Typography>
								</Box>

								<Button
									variant="contained"
									fullWidth
									sx={{
										mt: 3,
										backgroundColor: "#E50914",
										"&:hover": {
											backgroundColor: "#b20710",
										},
									}}
								>
									Alugar
								</Button>
							</Box>
						</Box>

						{/* Botão fechar */}
						<IconButton
							onClick={() => setOpenModal(false)}
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
								color: "white",
							}}
						>
						</IconButton>
					</DialogContent>
				)}
			</Dialog>
			<Container maxWidth="lg" sx={{ mt: 6 }}>
				{/* 🔎 Barra de Busca + Dropdown */}
				<Box
					display="flex"
					gap={2}
					mb={4}
					flexWrap="wrap"
					alignItems="center"
				>
					<TextField
						fullWidth
						placeholder="Buscar filme..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
								</InputAdornment>
							),
						}}
						sx={{
							flex: 2,
							backgroundColor: "#1f1f1f",
							borderRadius: 2,
							input: { color: "white" },
						}}
					/>

					<TextField
						select
						value={selectedCategory}
						onChange={(e) =>
							setSelectedCategory(
								e.target.value === "all"
									? "all"
									: Number(e.target.value)
							)
						}
						sx={{
							flex: 0.5,
							backgroundColor: "#fff",
							borderRadius: 2,
							minWidth: 200,
						}}
					>
						<MenuItem value="all">Todas Categorias</MenuItem>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</TextField>
				</Box>

				<Typography
					variant="h4"
					gutterBottom
					sx={{ color: "#E50914", fontWeight: "bold" }}
				>
					Filmes
				</Typography>

				{filteredMovies.length === 0 && (
					<Typography>Nenhum filme encontrado.</Typography>
				)}

				<Grid container spacing={3}>
						{filteredMovies.map((movie) => (
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
									"&:hover": { transform: "scale(1.05)" },
									"&:hover .overlay": { opacity: 1 },
								}}
								onClick={() => {
									setSelectedMovie(movie);
									setOpenModal(true);
								}}
							>
								<CardMedia
									component="img"
									image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
									alt={movie.title}
									sx={{ height: 380, objectFit: "cover" }}
								/>

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
		</>
	);
}