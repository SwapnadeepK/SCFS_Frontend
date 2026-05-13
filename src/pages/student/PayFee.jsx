import { useState } from "react";

import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

import { useSnackbar } from "notistack";

const paymentMethods = [
  "UPI",
  "CARD",
  "NETBANKING",
  "CASH",
];

const PayFee = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const fee = location.state;

  const [form, setForm] = useState({
    fee_id: fee?.id || "",
    transaction_ref: "",
    payment_method: "UPI",
  });

  if (!fee) {
    return (
      <Paper sx={{ p: 4, mt: 5, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6">
          Invalid Fee Request
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/student/fees")}
          >
            Back
          </Button>
        </Box>
      </Paper>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitPayment = async () => {
    try {
      await API.post("/fees/pay", form);

      enqueueSnackbar(
        "Payment submitted successfully",
        {
          variant: "success",
        }
      );

      navigate("/student/fees");
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message ||
          "Payment failed",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Pay Fee
      </Typography>

      <Typography mb={1}>
        Amount: ₹{fee.amount}
      </Typography>

      <Typography mb={3}>
        Semester: {fee.semester_name}
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>

        <TextField
          name="transaction_ref"
          label="Transaction Reference"
          value={form.transaction_ref}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          name="payment_method"
          label="Payment Method"
          value={form.payment_method}
          onChange={handleChange}
          fullWidth
        >
          {paymentMethods.map((method) => (
            <MenuItem
              key={method}
              value={method}
            >
              {method}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={submitPayment}
        >
          Submit Payment
        </Button>

      </Box>
    </Paper>
  );
};

export default PayFee;