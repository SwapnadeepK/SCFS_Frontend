import {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";

import API from "../../api/axios";

import {
  useSnackbar,
} from "notistack";

const FeeApprovals = () => {
  const { enqueueSnackbar } =
    useSnackbar();

  const [payments, setPayments] =
    useState([]);

  const fetchPayments =
    async () => {
      try {
        const res =
          await API.get(
            "/fee-payments/pending"
          );

        setPayments(
          res.data.data || []
        );
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    fetchPayments();
  }, []);

  const approvePayment =
    async (id) => {
      try {
        await API.put(
          `/fee-payments/approve/${id}`
        );

        enqueueSnackbar(
          "Payment approved",
          {
            variant:
              "success",
          }
        );

        fetchPayments();
      } catch (err) {
        console.error(err);

        enqueueSnackbar(
          "Approval failed",
          {
            variant: "error",
          }
        );
      }
    };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        mb={3}
        fontWeight={700}
      >
        Fee Approvals
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Student
                </TableCell>

                <TableCell>
                  Transaction ID
                </TableCell>

                <TableCell>
                  Payment Method
                </TableCell>

                <TableCell>
                  Amount
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.map(
                (item) => (
                  <TableRow
                    key={item.id}
                  >
                    <TableCell>
                      {
                        item.full_name
                      }
                    </TableCell>

                    <TableCell>
                      {
                        item.transaction_id
                      }
                    </TableCell>

                    <TableCell>
                      {
                        item.payment_method
                      }
                    </TableCell>

                    <TableCell>
                      ₹
                      {item.amount}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="PENDING"
                        color="warning"
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          approvePayment(
                            item.id
                          )
                        }
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FeeApprovals;