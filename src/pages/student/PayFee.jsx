import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useSnackbar,
} from "notistack";

import API from "../../api/axios";

const PayFee = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const { enqueueSnackbar } =
    useSnackbar();

  const fee = location.state?.fee;

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      transaction_id: "",
      payment_method: "",
    });

  /* =========================================
     HANDLE CHANGE
  ========================================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================================
     SUBMIT
  ========================================= */
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await API.post(
        "/fee-payments/submit",
        {
          student_id: user.id,
          fee_structure_id:
            fee.id,
          transaction_id:
            formData.transaction_id,
          payment_method:
            formData.payment_method,
        }
      );

      enqueueSnackbar(
        "Payment submitted successfully",
        {
          variant: "success",
        }
      );

      navigate("/student/fees");
    } catch (err) {
      console.error(err);

      enqueueSnackbar(
        "Payment failed",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fee) {
    return (
      <Typography>
        Invalid fee details
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Pay Fee
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Grid
          container
          spacing={3}
        >
          {/* LEFT */}
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="h6"
              mb={2}
            >
              Fee Details
            </Typography>

            <Typography>
              <strong>
                Degree:
              </strong>{" "}
              {fee.degree_name}
            </Typography>

            <Typography>
              <strong>
                Semester:
              </strong>{" "}
              {fee.semester_name}
            </Typography>

            <Typography>
              <strong>
                Academic Year:
              </strong>{" "}
              {fee.academic_year}
            </Typography>

            <Typography>
              <strong>
                Amount:
              </strong>{" "}
              ₹{fee.amount}
            </Typography>

            <Typography>
              <strong>
                Due Date:
              </strong>{" "}
              {new Date(
                fee.due_date
              ).toLocaleDateString(
                "en-GB"
              )}
            </Typography>

            {/* DUMMY QR */}
            <Box mt={4}>
              <Typography
                variant="subtitle1"
                mb={2}
              >
                Scan QR to Pay
              </Typography>

              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VTU-FEE-PAYMENT"
                alt="QR"
              />
            </Box>
          </Grid>

          {/* RIGHT */}
          <Grid
            item
            xs={12}
            md={6}
          >
            <form
              onSubmit={
                handleSubmit
              }
            >
              <TextField
                fullWidth
                label="Transaction ID"
                name="transaction_id"
                value={
                  formData.transaction_id
                }
                onChange={
                  handleChange
                }
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Payment Method"
                name="payment_method"
                value={
                  formData.payment_method
                }
                onChange={
                  handleChange
                }
                margin="normal"
                placeholder="UPI / Card / Net Banking"
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Submit Payment"}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PayFee;