import React, { useCallback, useState, type FC } from "react";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../shared/api/firebase.js";

export const PageAuth: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      // Сначала попробуем popup
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error: unknown) {
      console.error("Popup login error:", error);
      const firebaseError = error as { code?: string; message?: string };

      // Если popup заблокирован, используем redirect
      if (
        firebaseError.code === "auth/popup-blocked" ||
        firebaseError.code === "auth/popup-closed-by-user" ||
        (firebaseError.message &&
          firebaseError.message.includes("Cross-Origin-Opener-Policy"))
      ) {
        try {
          console.log("Trying redirect login...");
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: unknown) {
          console.error("Redirect login error:", redirectError);
          setError("Failed to sign in. Please try again.");
        }
      } else {
        setError(
          firebaseError.message || "Failed to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Обработка результата redirect при возвращении на страницу
  React.useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect login successful");
          navigate("/");
        }
      } catch (error: unknown) {
        console.error("Redirect result error:", error);
        const firebaseError = error as { code?: string };
        if (firebaseError.code !== "auth/no-current-user") {
          setError("Failed to complete sign in. Please try again.");
        }
      }
    };

    handleRedirectResult();
  }, [navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Shopper
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage your shopping lists
        </Typography>

        <Box>
          <Button
            variant="contained"
            onClick={handleLogin}
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
