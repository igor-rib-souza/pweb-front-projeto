import { useEffect, useState } from "react";
import {
	Container,
	Typography,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Alert,
	Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Category {
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
}

export default function Categories() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("http://localhost:3000/category");

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data?.message || "Erro ao buscar categorias.");
				}

				setCategories(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

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
		<Container maxWidth="lg" sx={{ mt: 8 }}>
			<Typography
				variant="h4"
				sx={{
					mb: 4,
					fontWeight: "bold",
					color: "#E50914",
				}}
			>
				Categorias
			</Typography>

			<Grid container spacing={3}>
				{categories.map((category) => (
						<Grid
							key={category.id}
							size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
						>
						<Card
							onClick={() =>
								navigate(`/category/${category.id}`)
							}
							sx={{
								cursor: "pointer",
								borderRadius: 3,
								background:
									"linear-gradient(135deg, #1f1f1f, #2a2a2a)",
								color: "white",
								height: 160,
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								transition: "0.3s",
								"&:hover": {
									transform: "scale(1.05)",
									boxShadow:
										"0 10px 30px rgba(0,0,0,0.6)",
									background:
										"linear-gradient(135deg, #E50914, #8B0000)",
								},
							}}
						>
							<CardContent>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										mb: 1,
									}}
								>
									{category.name}
								</Typography>

								<Typography
									variant="body2"
									sx={{
										opacity: 0.8,
									}}
								>
									{category.description ||
										"Explore os melhores títulos desta categoria."}
								</Typography>
							</CardContent>

							<Box
								sx={{
									px: 2,
									pb: 2,
									fontSize: "0.8rem",
									opacity: 0.6,
								}}
							>
								Clique para explorar →
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}