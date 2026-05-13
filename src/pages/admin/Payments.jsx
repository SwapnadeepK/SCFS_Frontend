import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFees } from "../../api/feesApi";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, TextField, MenuItem, Select,
  InputLabel, FormControl, TableSortLabel,
  TablePagination, Button, Chip, CircularProgress
} from "@mui/material";

import { exportToExcel } from "../../utils/exportExcel";
import { exportToPDF } from "../../utils/exportPDF";
import { useSnackbar } from "notistack";

// ✅ MATCH BACKEND fee_status_id
const statusMap = {
  1: { label: "Pending", color: "warning" },
  2: { label: "Paid", color: "success" },
  3: { label: "Failed", color: "error" },
};

const Payments = () => {
  const location = useLocation();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [orderBy, setOrderBy] = useState("date"); // matches backend
  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { enqueueSnackbar } = useSnackbar();

  // ✅ NAVBAR SEARCH SUPPORT
  useEffect(() => {
    if (location.state?.results) {
      const results = location.state.results;

      setData(results.data || results);
      setTotal(results.total || results.length || 0);

      enqueueSnackbar("Search results loaded", {
        variant: "success",
      });
    }
  }, [location.state, enqueueSnackbar]);

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    if (location.state?.results) return;

    setLoading(true);

    getFees({
      search,
      status,
      sortBy: orderBy,
      order,
      page, // ✅ backend uses 0-based
      limit: rowsPerPage,
    })
      .then((res) => {
        // ✅ SAFETY: handle undefined safely
        setData(res?.data?.data || []);
        setTotal(res?.data?.total || 0);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        enqueueSnackbar("Error fetching fees", { variant: "error" });
      })
      .finally(() => setLoading(false));

  }, [search, status, orderBy, order, page, rowsPerPage, enqueueSnackbar, location.state]);

  // ✅ SORT HANDLER
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  // ✅ EXPORT HANDLER
  const handleExport = (type) => {
    if (!data.length) {
      enqueueSnackbar("No data to export", { variant: "warning" });
      return;
    }

    if (type === "excel") exportToExcel(data);
    if (type === "pdf") exportToPDF(data);

    enqueueSnackbar("Export successful", { variant: "success" });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Payments
      </Typography>

      {/* 🔍 FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

        <TextField
          label="Search (email)"
          size="small"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />

        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={1}>Pending</MenuItem>
            <MenuItem value={2}>Paid</MenuItem>
            <MenuItem value={3}>Failed</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => handleExport("excel")}>
          Export Excel
        </Button>

        <Button variant="outlined" onClick={() => handleExport("pdf")}>
          Export PDF
        </Button>
      </div>

      {/* 📊 TABLE */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={order}
                    onClick={() => handleSort("email")}
                  >
                    Student Email
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amount"}
                    direction={order}
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={order}
                    onClick={() => handleSort("date")}
                  >
                    Submitted Date
                  </TableSortLabel>
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                data.map((row) => (
                  <TableRow key={row.id} hover>

                    <TableCell>{row.email}</TableCell>

                    <TableCell>₹{Number(row.amount).toFixed(2)}</TableCell>

                    <TableCell>
                      <Chip
                        label={statusMap[row.fee_status_id]?.label || "Unknown"}
                        color={statusMap[row.fee_status_id]?.color || "default"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {row.submitted_at
                        ? new Date(row.submitted_at).toLocaleDateString()
                        : "-"}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* 📄 PAGINATION */}
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default Payments;