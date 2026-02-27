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

interface Category {
	id: number;
	name: string;
	description: string;
	createdAt: string;
}

export default function Categories() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const token = localStorage.getItem("token");

	// 🔥 Buscar categorias
	const fetchCategories = async () => {
		const response = await fetch("http://localhost:3000/category", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Erro ao buscar categorias");

		const data = await response.json();
		setCategories(data);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				await fetchCategories();
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
				Categorias
			</Typography>

			<Button
				variant="contained"
				sx={{
					mb: 3,
					backgroundColor: "#E50914",
					"&:hover": { backgroundColor: "#b20710" },
				}}
			>
				Nova Categoria
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
								"Nome",
								"Descrição",
								"Data de Criação",
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
						{categories.map((category) => (
							<TableRow
								key={category.id}
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
								<TableCell>{category.id}</TableCell>
								<TableCell>{category.name}</TableCell>
								<TableCell>
									{category.description}
								</TableCell>
								<TableCell>
									{formatDate(category.createdAt)}
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