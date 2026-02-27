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
	Chip,
	Button,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
	id: number;
	name: string;
	email: string;
	cpf: string;
	role: string;
	createdAt: string;
}

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const token = localStorage.getItem("token");

	const fetchUsers = async () => {
		const response = await fetch("http://localhost:3000/users", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Erro ao buscar usuários");

		const data = await response.json();
		setUsers(data);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				await fetchUsers();
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

	const getRoleChip = (role: string) => {
		const isAdmin = role.toLowerCase() === "admin";

		return (
			<Chip
				label={isAdmin ? "ADMIN" : "USER"}
				sx={{
					backgroundColor: isAdmin ? "#E50914" : "#1976d2",
					color: "white",
					fontWeight: "bold",
					borderRadius: "20px",
				}}
			/>
		);
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(
				`http://localhost:3000/users/${id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!response.ok)
				throw new Error("Erro ao deletar usuário");

			await fetchUsers();
		} catch (err: any) {
			setError(err.message);
		}
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
				Usuários
			</Typography>

			<Button
				variant="contained"
				sx={{
					mb: 3,
					backgroundColor: "#E50914",
					"&:hover": { backgroundColor: "#b20710" },
				}}
			>
				Novo Usuário
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
								"Email",
								"CPF",
								"Role",
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
						{users.map((user) => (
							<TableRow
								key={user.id}
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
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.cpf}</TableCell>
								<TableCell>
									{getRoleChip(user.role)}
								</TableCell>
								<TableCell>
									{formatDate(user.createdAt)}
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
										onClick={() =>
											handleDelete(user.id)
										}
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