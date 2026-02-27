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

interface Movie {
	id: number;
	title: string;
	overview: string;
	posterPath: string;
}

interface Props {
	open: boolean;
	onClose: () => void;
	movie: Movie | null;
	onRent: () => void;
}

export default function MovieDetailsModal({
	open,
	onClose,
	movie,
	onRent,
}: Props) {
	if (!movie) return null;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogContent
				sx={{
					backgroundColor: "#141414",
					color: "white",
				}}
			>
				<Box display="flex" gap={4} flexWrap="wrap">
					<Box flex={1} minWidth={250}>
						<CardMedia
							component="img"
							image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
							alt={movie.title}
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
								{movie.title}
							</Typography>

							<Typography mb={2}>
								{movie.overview}
							</Typography>

							<Typography variant="h6" color="#E50914">
								R$ 9,90 / dia
							</Typography>
						</Box>

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
							Alugar
						</Button>
					</Box>
				</Box>

				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
				>
					<CloseIcon />
				</IconButton>
			</DialogContent>
		</Dialog>
	);
}