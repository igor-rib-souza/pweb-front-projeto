import { Container, Typography } from "@mui/material";

export default function Dashboard() {
	return (
		<Container maxWidth="lg" sx={{ mt: 6 }}>
			<Typography variant="h4" sx={{ color: "white", mb: 4 }}>
				Dashboard
			</Typography>
		</Container>
	);
}