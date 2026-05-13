import { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const TransactionHistory = () => {
  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/fees/my");

    setTransactions(res.data.data || []);
  };

  return (
    <Paper sx={{ p: 4, m: 4 }}>
      <Typography variant="h5" mb={3}>
        Transaction History
      </Typography>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Transaction Ref</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Paid At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                {tx.transaction_ref}
              </TableCell>

              <TableCell>
                ₹{tx.amount}
              </TableCell>

              <TableCell>
                {tx.payment_method}
              </TableCell>

              <TableCell>
                {tx.fee_status}
              </TableCell>

              <TableCell>
                {tx.paid_at
                  ? tx.paid_at.split("T")[0]
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </Paper>
  );
};

export default TransactionHistory;