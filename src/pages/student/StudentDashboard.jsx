// src/pages/student/StudentDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     FETCH FEES
  ========================================= */
  const fetchFees = async () => {
    try {
      const res = await API.get("/fees/my");

      setFees(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* =====================================
          HEADER
      ===================================== */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Student Dashboard
      </Typography>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">
                Total Fees
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {fees.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">
                Paid Fees
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight={700}
              >
                {
                  fees.filter(
                    (f) =>
                      f.fee_status === "PAID"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">
                Pending Fees
              </Typography>

              <Typography
                variant="h4"
                color="warning.main"
                fontWeight={700}
              >
                {
                  fees.filter(
                    (f) =>
                      f.fee_status !== "PAID"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =====================================
          FEES LIST
      ===================================== */}
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Fee Details
      </Typography>

      <Grid container spacing={3}>
        {fees.length > 0 ? (
          fees.map((fee) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={fee.id}
            >
              <Card
                elevation={5}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={1}
                    mb={2}
                    alignItems="center"
                  >
                    <ReceiptLongIcon />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      Fee Record
                    </Typography>
                  </Stack>

                  <Typography>
                    <strong>
                      College:
                    </strong>{" "}
                    {fee.college_name}
                  </Typography>

                  <Typography>
                    <strong>
                      Department:
                    </strong>{" "}
                    {fee.department_name}
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

                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight={700}
                    mt={2}
                  >
                    ₹{fee.amount}
                  </Typography>

                  <Typography mt={1}>
                    <strong>
                      Due Date:
                    </strong>{" "}
                    {fee.due_date
                      ? new Date(
                          fee.due_date
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                  >
                    <Chip
                      label={
                        fee.fee_status ||
                        "UNKNOWN"
                      }
                      color={
                        fee.fee_status ===
                        "PAID"
                          ? "success"
                          : fee.fee_status ===
                            "OVERDUE"
                          ? "error"
                          : "warning"
                      }
                    />

                    <Chip
                      label={
                        fee.approval_status ||
                        "PENDING"
                      }
                      variant="outlined"
                      color={
                        fee.approval_status ===
                        "APPROVED"
                          ? "success"
                          : "warning"
                      }
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    mt={3}
                  >
                    {fee.fee_status ===
                    "PAID" ? (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={
                          <DownloadIcon />
                        }
                        onClick={() =>
                          window.open(
                            `http://localhost:5000/api/receipts/${fee.id}`,
                            "_blank"
                          )
                        }
                      >
                        Receipt
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={
                          <PaymentIcon />
                        }
                        onClick={() =>
                          navigate(
                            "/student/pay-fee",
                            {
                              state: {
                                fee,
                              },
                            }
                          )
                        }
                      >
                        Pay Now
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  align="center"
                  color="text.secondary"
                >
                  No fee records found.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;