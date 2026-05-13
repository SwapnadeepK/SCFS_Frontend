import { useEffect, useMemo, useState, useCallback } from "react";
import { getUsers } from "../../api/usersApi";

import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, TextField, MenuItem, Select,
  InputLabel, FormControl, TableSortLabel,
  TablePagination, Chip, CircularProgress,
  Box, Button
} from "@mui/material";

import { useSnackbar } from "notistack";

/* ---------------- CONSTANTS ---------------- */

const STATUS_MAP = {
  1: { label: "Active", color: "success" },
  2: { label: "Inactive", color: "default" },
  3: { label: "Suspended", color: "error" },
};

/* ---------------- COMPONENT ---------------- */

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { enqueueSnackbar } = useSnackbar();

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        headers: { "Cache-Control": "no-cache" } // ✅ FIX CACHE
      });

      console.log("USERS 👉", res.data); // 🔍 DEBUG

      setUsers(res.data?.data || []);
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch users",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---------------- DEBOUNCED SEARCH ---------------- */

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- FILTER + SORT ---------------- */

  const filteredData = useMemo(() => {
    let temp = [...users];

    if (debouncedSearch) {
      temp = temp.filter((u) =>
        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (status) {
      temp = temp.filter((u) => u.status_id === Number(status));
    }

    temp.sort((a, b) => {
      let valA = a?.[orderBy];
      let valB = b?.[orderBy];

      if (orderBy === "created_at") {
        valA = new Date(valA || 0);
        valB = new Date(valB || 0);
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return temp;
  }, [users, debouncedSearch, status, orderBy, order]);

  /* ---------------- PAGINATION ---------------- */

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  /* ---------------- UI ---------------- */

  const handleSort = (column) => {
  const isAsc = orderBy === column && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(column); // ✅ THIS FIXES WARNING + LOGIC
};

  return (
    <Paper sx={{ p: 3 }}>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Users</Typography>

        {/* 🔥 Manual refresh */}
        <Button variant="outlined" onClick={fetchUsers}>
          Refresh
        </Button>
      </Box>

      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>

        <TextField
          label="Search Email"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={2}>Inactive</MenuItem>
            <MenuItem value={3}>Suspended</MenuItem>
          </Select>
        </FormControl>

      </Box>

      {/* LOADING */}
      {loading ? (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <CircularProgress />
        </Box>
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
                  Email
                </TableSortLabel>
                </TableCell>

                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "created_at"}
                    direction={order}
                    onClick={() => handleSort("created_at")}
                  >
                  Created At
                </TableSortLabel>
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow key={user.id} hover>

                    <TableCell>{user.email}</TableCell>

                    {/* ✅ FIXED ROLE */}
                    <TableCell>
                      {user.role_name || user.role || "Unknown"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={STATUS_MAP[user.status_id]?.label || "Unknown"}
                        color={STATUS_MAP[user.status_id]?.color || "default"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredData.length}
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

export default Users;