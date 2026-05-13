import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useState } from "react";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.email || !form.password) {
        enqueueSnackbar("All fields required", { variant: "warning" });
        return;
      }

      const user = await login(form.email, form.password);

      ///console.log("LOGIN USER 👉", user); // ✅ DEBUG

      enqueueSnackbar("Login successful", { variant: "success" });

      if (user.role === "UNVERIFIED") {
        navigate("/request-role", { replace: true });
        return;
      }

      /* 🔥 AUTO REDIRECT */
      switch (user.role) {
        case "UNVERIFIED":
          navigate("/request-role");
          break;
        case "STUDENT":
          navigate("/student");
          break;
        case "VTU_ADMIN":
          navigate("/admin");
          break;
        case "PROFESSOR":
        case "PRINCIPAL":
          navigate("/admin");
          break;
        default:
          navigate("/unauthorized");
      }

    } catch (err) {
      enqueueSnackbar(
        err || "Invalid email or password",
        { variant: "error" }
      );
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ maxWidth: 400, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;