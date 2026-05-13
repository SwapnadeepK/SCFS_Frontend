import { useEffect, useState, useCallback } from "react";

import API from "../../api/axios";

import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const StudentFees = () => {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/fees/my");

      setFees(res.data.data || []);
    } catch (err) {
      enqueueSnackbar("Failed to load fees", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "success":
        return "success";

      case "pending":
        return "warning";

      case "failed":
        return "error";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 1200, mx: "auto", mt: 5 }}>
      <Typography variant="h4" mb={4}>
        My Fees
      </Typography>

      <Grid container spacing={3}>
        {fees.map((fee) => (
          <Grid item xs={12} md={6} key={fee.id}>
            <Card elevation={4}>
              <CardContent>

                <Typography variant="h6">
                  {fee.degree_name}
                </Typography>

                <Typography>
                  Semester: {fee.semester_name}
                </Typography>

                <Typography>
                  Department: {fee.department_name}
                </Typography>

                <Typography>
                  Amount: ₹{fee.amount}
                </Typography>

                <Typography>
                  Due Date: {fee.due_date?.split("T")[0]}
                </Typography>

                <Box mt={2}>
                  <Chip
                    label={`Fee: ${fee.fee_status}`}
                    color={getStatusColor(fee.fee_status)}
                    sx={{ mr: 1 }}
                  />

                  <Chip
                    label={`Approval: ${fee.approval_status}`}
                    color={getStatusColor(fee.approval_status)}
                  />
                </Box>

                {fee.transaction_ref && (
                  <Box mt={2}>
                    <Typography variant="body2">
                      Transaction Ref:
                      {" "}
                      {fee.transaction_ref}
                    </Typography>

                    <Typography variant="body2">
                      Payment Method:
                      {" "}
                      {fee.payment_method}
                    </Typography>
                  </Box>
                )}

                <Box mt={3}>
                  {fee.approval_status?.toLowerCase() !==
                    "approved" && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/student/pay-fee", {
                          state: fee,
                        })
                      }
                    >
                      Pay Fee
                    </Button>
                  )}
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default StudentFees;