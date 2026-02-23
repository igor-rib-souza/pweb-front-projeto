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
		<Container maxWidth="md" sx={{ mt: 6 }}>
			<Typography variant="h4" gutterBottom>
				Categorias
			</Typography>

				<Grid container spacing={4}>
					{categories.map((category) => (
						<Grid
							key={category.id}
							size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
						>
						<Card
							sx={{ cursor: "pointer" }}
							onClick={() =>
								navigate(`/category/${category.id}`)
							}
						>
							<CardContent>
								<Typography variant="h6">
									{category.name}
								</Typography>

								<Typography variant="body2" color="text.secondary">
									{category.description || "Sem descrição"}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
}