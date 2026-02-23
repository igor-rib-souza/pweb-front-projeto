import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <Typography variant="h2" fontWeight="bold">
        404
      </Typography>

      <Typography variant="h5" mt={2}>
        Página não encontrada
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={handleBack}
      >
        Voltar
      </Button>
    </Box>
  );
}