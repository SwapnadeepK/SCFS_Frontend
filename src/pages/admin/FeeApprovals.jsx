import {
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../../api/axios";

import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
} from "@mui/material";

import { useSnackbar } from "notistack";

const FeeApprovals = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/fees/approvals");

      setFees(res.data.data || []);
    } catch (err) {
      enqueueSnackbar("Failed to load approvals", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const approvePayment = async (fee_id) => {
    try {
      await API.post("/fees/approve", {
        fee_id,
      });

      enqueueSnackbar("Payment approved", {
        variant: "success",
      });

      fetchApprovals();
    } catch (err) {
      enqueueSnackbar("Approval failed", {
        variant: "error",
      });
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
    <Paper sx={{ p: 4, m: 4 }}>
      <Typography variant="h4" mb={4}>
        Fee Verification Panel
      </Typography>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>USN</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Transaction Ref</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fees.map((fee) => (
            <TableRow key={fee.id}>

              <TableCell>
                {fee.full_name}
              </TableCell>

              <TableCell>
                {fee.usn}
              </TableCell>

              <TableCell>
                ₹{fee.amount}
              </TableCell>

              <TableCell>
                {fee.transaction_ref}
              </TableCell>

              <TableCell>
                {fee.payment_method}
              </TableCell>

              <TableCell>
                <Chip
                  label={fee.approval_status}
                  color={
                    fee.approval_status === "APPROVED"
                      ? "success"
                      : "warning"
                  }
                />
              </TableCell>

              <TableCell>
                {fee.approval_status !==
                  "APPROVED" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      approvePayment(fee.id)
                    }
                  >
                    Approve
                  </Button>
                )}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </Paper>
  );
};

export default FeeApprovals;