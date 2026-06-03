import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import API from "../../api/axios";

const StudentFees = () => {
  const navigate = useNavigate();

  const { enqueueSnackbar } =
    useSnackbar();

  const [loading, setLoading] =
    useState(true);

  const [fees, setFees] = useState(
    []
  );

  /* =========================================
     FETCH FEES
  ========================================= */
  const fetchFees = useCallback(
    async () => {
      try {
        setLoading(true);

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const res = await API.get(
          `/student-fees/my-fees/${user.id}`
        );

        setFees(res.data.data || []);
      } catch (err) {
        console.error(err);

        enqueueSnackbar(
          "Failed to load fees",
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  /* =========================================
     LOAD
  ========================================= */
  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        My Fees
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        View and pay semester fees.
      </Typography>

      {/* TABLE */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Degree
                </TableCell>

                <TableCell>
                  Semester
                </TableCell>

                <TableCell>
                  Academic Year
                </TableCell>

                <TableCell>
                  Amount
                </TableCell>

                <TableCell>
                  Due Date
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fees.length > 0 ? (
                fees.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                  >
                    <TableCell>
                      {
                        item.degree_name
                      }
                    </TableCell>

                    <TableCell>
                      {
                        item.semester_name
                      }
                    </TableCell>

                    <TableCell>
                      {
                        item.academic_year
                      }
                    </TableCell>

                    <TableCell>
                      ₹
                      {Number(
                        item.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        item.due_date
                      ).toLocaleDateString(
                        "en-GB"
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          item.payment_status ||
                          "PENDING"
                        }
                        color={
                          item.payment_status ===
                          "PAID"
                            ? "success"
                            : item.payment_status ===
                              "APPROVAL_PENDING"
                            ? "info"
                            : "warning"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {item.payment_status ===
                      "PAID" ? (
                        <Button
                          variant="outlined"
                          color="success"
                          disabled
                        >
                          Paid
                        </Button>
                      ) : item.payment_status ===
                        "APPROVAL_PENDING" ? (
                        <Button
                          variant="outlined"
                          color="info"
                          disabled
                        >
                          Waiting Approval
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              "/student/pay-fee",
                              {
                                state: {
                                  fee:
                                    item,
                                },
                              }
                            )
                          }
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No fee structures
                    available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentFees;