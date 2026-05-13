import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";

import { useState } from "react";
import API from "../api/axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      enqueueSnackbar("All fields are required", { variant: "warning" });
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      enqueueSnackbar("Signup successful! Please login.", {
        variant: "success",
      });

      navigate("/login");

    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Signup failed",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={form.email}
          onChange={handleChange("email")}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={form.password}
          onChange={handleChange("password")}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Signup"}
        </Button>

      </Box>
    </Container>
  );
};

export default Signup;