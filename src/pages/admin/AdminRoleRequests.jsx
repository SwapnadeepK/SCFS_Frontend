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
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AdminRoleRequests = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] =
    useState(null);

  const [tab, setTab] = useState(0);
  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("");

  /* ================= FETCH ================= */
  const fetchRequests = useCallback(
    async () => {
      setLoading(true);

      try {
        const res = await API.get(
          "/role-requests"
        );

        const data =
          res.data?.data || [];

        setRequests(data);
        setFiltered(data);
      } catch (err) {
        enqueueSnackbar(
          "Failed to fetch requests",
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

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ================= COUNTS ================= */
  const pendingCount =
    requests.filter(
      (r) =>
        r.status === "PENDING" ||
        !r.status
    ).length;

  const approvedCount =
    requests.filter(
      (r) =>
        r.status === "APPROVED"
    ).length;

  const rejectedCount =
    requests.filter(
      (r) =>
        r.status === "REJECTED"
    ).length;

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...requests];

    if (search) {
      data = data.filter((r) =>
        (r.email || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }

    if (roleFilter) {
      data = data.filter(
        (r) =>
          r.requested_role ===
          roleFilter
      );
    }

    if (tab === 0) {
      data = data.filter(
        (r) =>
          r.status ===
            "PENDING" ||
          !r.status
      );
    } else if (tab === 1) {
      data = data.filter(
        (r) =>
          r.status ===
          "APPROVED"
      );
    } else if (tab === 2) {
      data = data.filter(
        (r) =>
          r.status ===
          "REJECTED"
      );
    }

    setFiltered(data);
  }, [
    search,
    tab,
    requests,
    roleFilter,
  ]);

  /* ================= APPROVE ================= */
  const approve = async (req) => {
    setProcessingId(
      req.request_id
    );

    try {
      await API.post(
        "/role-requests/approve",
        {
          request_id:
            req.request_id,
          user_id: req.id,
          role_id:
            req.requested_role_id,
        }
      );

      enqueueSnackbar(
        "Approved successfully",
        {
          variant: "success",
        }
      );

      fetchRequests();
    } catch (err) {
      enqueueSnackbar(
        "Approval failed",
        {
          variant: "error",
        }
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= REJECT ================= */
  const reject = async (req) => {
    setProcessingId(
      req.request_id
    );

    try {
      await API.post(
        "/role-requests/reject",
        {
          request_id:
            req.request_id,
        }
      );

      enqueueSnackbar(
        "Rejected successfully",
        {
          variant: "info",
        }
      );

      fetchRequests();
    } catch (err) {
      enqueueSnackbar(
        "Rejection failed",
        {
          variant: "error",
        }
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= STATUS CHIP ================= */
  const getStatusChip = (
    status
  ) => {
    if (
      !status ||
      status === "PENDING"
    ) {
      return (
        <Chip
          label="PENDING"
          color="warning"
          size="small"
        />
      );
    }

    if (
      status === "APPROVED"
    ) {
      return (
        <Chip
          label="APPROVED"
          color="success"
          size="small"
        />
      );
    }

    if (
      status === "REJECTED"
    ) {
      return (
        <Chip
          label="REJECTED"
          color="error"
          size="small"
        />
      );
    }

    return (
      <Chip
        label="UNKNOWN"
        size="small"
      />
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
      >
        Role Requests
      </Typography>

      {/* SUMMARY */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">
                Pending
              </Typography>

              <Typography variant="h4">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">
                Approved
              </Typography>

              <Typography variant="h4">
                {approvedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">
                Rejected
              </Typography>

              <Typography variant="h4">
                {rejectedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FILTERS */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          label="Search Email"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <FormControl
          size="small"
          sx={{
            minWidth: 180,
          }}
        >
          <InputLabel>
            Requested Role
          </InputLabel>

          <Select
            value={roleFilter}
            label="Requested Role"
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
          >
            <MenuItem value="">
              All
            </MenuItem>

            <MenuItem value="STUDENT">
              Student
            </MenuItem>

            <MenuItem value="STAFF">
              Staff
            </MenuItem>

            <MenuItem value="PROFESSOR">
              Professor
            </MenuItem>

            <MenuItem value="PRINCIPAL">
              Principal
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(e, v) =>
          setTab(v)
        }
        sx={{ mb: 2 }}
      >
        <Tab
          label={`Pending (${pendingCount})`}
        />

        <Tab
          label={`Approved (${approvedCount})`}
        />

        <Tab
          label={`Rejected (${rejectedCount})`}
        />
      </Tabs>

      {loading ? (
        <Box
          sx={{
            textAlign:
              "center",
            p: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Email
              </TableCell>

              <TableCell>
                Current Role
              </TableCell>

              <TableCell>
                Requested Role
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Requested On
              </TableCell>

              <TableCell>
                Processed By
              </TableCell>

              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length >
            0 ? (
              filtered.map(
                (req, index) => (
                  <TableRow
                    key={index}
                    hover
                  >
                    {/* <TableCell>
                      {req.full_name ||
                        "-"}
                    </TableCell> */}

                    <TableCell>
                      {req.email}
                    </TableCell>

                    <TableCell>
                      {
                        req.role_name
                      }
                    </TableCell>

                    <TableCell>
                      {req.requested_role ||
                        "-"}
                    </TableCell>

                    <TableCell>
                      {getStatusChip(
                        req.status
                      )}
                    </TableCell>

                    <TableCell>
                      {req.created_at
                        ? new Date(
                            req.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {req.approved_by ||
                        req.rejected_by ||
                        "-"}
                    </TableCell>

                    <TableCell>
                      {(req.status ===
                        "PENDING" ||
                        !req.status) && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={
                              processingId ===
                              req.request_id
                            }
                            onClick={() =>
                              approve(
                                req
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{
                              ml: 1,
                            }}
                            disabled={
                              processingId ===
                              req.request_id
                            }
                            onClick={() =>
                              reject(
                                req
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  <Typography color="text.secondary">
                    No role
                    requests found
                    for this
                    category.
                  </Typography>
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