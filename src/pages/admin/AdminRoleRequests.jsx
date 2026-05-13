import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import { useSnackbar } from "notistack";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";

const AdminRoleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState(0); // 0=PENDING,1=APPROVED,2=REJECTED
  const [search, setSearch] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  /* ================= FETCH ================= */
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/role-requests"); // uses backend

      const data = res.data?.data || [];
      setRequests(data);
      setFiltered(data);

    } catch (err) {
      enqueueSnackbar("Failed to fetch requests", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...requests];

    // 🔍 SEARCH
    if (search) {
      data = data.filter((r) =>
        r.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🧠 TAB FILTER
    if (tab === 0) {
      data = data.filter((r) => r.status === "PENDING" || !r.status);
    } else if (tab === 1) {
      data = data.filter((r) => r.status === "APPROVED");
    } else if (tab === 2) {
      data = data.filter((r) => r.status === "REJECTED");
    }

    setFiltered(data);
  }, [search, tab, requests]);

  /* ================= ACTIONS ================= */
  const approve = async (req) => {
    try {
      await API.post("/role-requests/approve", {
        request_id: req.request_id,
        user_id: req.id,
        role_id: req.requested_role_id,
      });

      enqueueSnackbar("Approved successfully", { variant: "success" });
      fetchRequests();

    } catch (err) {
      enqueueSnackbar("Approval failed", { variant: "error" });
    }
  };

  const reject = async (req) => {
    try {
      await API.post("/role-requests/reject", {
        request_id: req.request_id,
      });

      enqueueSnackbar("Rejected successfully", { variant: "info" });
      fetchRequests();

    } catch (err) {
      enqueueSnackbar("Rejection failed", { variant: "error" });
    }
  };

  /* ================= STATUS CHIP ================= */
  const getStatusChip = (status) => {
    if (!status || status === "PENDING") {
      return <Chip label="PENDING" color="warning" size="small" />;
    }
    if (status === "APPROVED") {
      return <Chip label="APPROVED" color="success" size="small" />;
    }
    if (status === "REJECTED") {
      return <Chip label="REJECTED" color="error" size="small" />;
    }
    return <Chip label="UNKNOWN" size="small" />;
  };

  /* ================= UI ================= */
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Role Requests
      </Typography>

      {/* 🔍 SEARCH */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* 🧠 TABS */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="Pending" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
      </Tabs>

      {/* ⏳ LOADING */}
      {loading ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Current Role</TableCell>
              <TableCell>Requested Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((req, index) => (
                <TableRow key={index} hover>

                  <TableCell>{req.email}</TableCell>

                  <TableCell>{req.role_name}</TableCell>

                  <TableCell>
                    {req.requested_role || "—"}
                  </TableCell>

                  <TableCell>
                    {getStatusChip(req.status)}
                  </TableCell>

                  <TableCell>
                    {(req.status === "PENDING" || !req.status) && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => approve(req)}
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{ ml: 1 }}
                          onClick={() => reject(req)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default AdminRoleRequests;