import {
	Dialog,
	DialogContent,
	Typography,
	Box,
	Button,
	CardMedia,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Rental {
	id: number;
	days: number;
	movie: {
		title: string;
		overview: string;
		posterPath: string;
	};
	payment?: {
		status?: string;
	};
}

interface Props {
	open: boolean;
	onClose: () => void;
	rental: Rental | null;
	onRent: () => void;
}

export default function RentalDetailsModal({
	open,
	onClose,
	rental,
	onRent,
}: Props) {
	if (!rental) return null;

	const isPaid = rental.payment?.status === "PAID";

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogContent
				sx={{
					backgroundColor: "#141414",
					color: "white",
					position: "relative",
				}}
			>
				<Box display="flex" gap={4} flexWrap="wrap">
					<Box flex={1} minWidth={250}>
						<CardMedia
							component="img"
							image={`https://image.tmdb.org/t/p/w500${rental.movie.posterPath}`}
							alt={rental.movie.title}
							sx={{ borderRadius: 2 }}
						/>
					</Box>

					<Box
						flex={1}
						display="flex"
						flexDirection="column"
						justifyContent="space-between"
					>
						<Box>
							<Typography variant="h5" fontWeight="bold" mb={2}>
								{rental.movie.title}
							</Typography>

							<Typography mb={2}>
								{rental.movie.overview}
							</Typography>

							<Typography variant="h6" color="#E50914">
								R$ 9,90 / dia
							</Typography>

							<Typography mt={2}>
								Status:{" "}
								{isPaid ? "Pagamento confirmado" : "Pagamento pendente"}								
							</Typography>
						</Box>

						{isPaid ? 
							<Button
								variant="contained"
								sx={{
									mt: 3,
									backgroundColor: "#E50914",
									"&:hover": {
										backgroundColor: "#b20710",
									},
								}}
								onClick={onRent}
							>
								Alugar Novamente
							</Button>
							:
							""}
					</Box>
				</Box>

				<IconButton
					onClick={onClose}
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						color: "white",
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogContent>
		</Dialog>
	);
}