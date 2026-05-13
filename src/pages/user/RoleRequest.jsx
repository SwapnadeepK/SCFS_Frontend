import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import { useSnackbar } from "notistack";

import {
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const RoleRequest = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  /* ================= CHECK EXISTING REQUEST ================= */
  const checkExistingRequest = useCallback(async () => {
    try {
      const res = await API.get("/role-requests/my");

      const requests = res.data?.data || [];

      if (requests.length > 0) {
        setAlreadyRequested(true);
      }
    } catch {
      enqueueSnackbar("Failed to check existing requests", {
        variant: "error",
      });
    }
  }, [enqueueSnackbar]);

  /* ================= FETCH ROLES ================= */
  const fetchRoles = useCallback(async () => {
    try {
      const res = await API.get("/roles/requestable");

      setRoles(res.data?.data || []);
    } catch {
      enqueueSnackbar("Failed to load roles", {
        variant: "error",
      });
    }
  }, [enqueueSnackbar]);

  /* ================= INIT ================= */
  useEffect(() => {
    checkExistingRequest();
    fetchRoles();
  }, [checkExistingRequest, fetchRoles]); // ✅ FIXED

  /* ================= REQUEST ROLE ================= */
  const handleRequest = async () => {
    if (!selectedRole) {
      enqueueSnackbar("Select a role", { variant: "warning" });
      return;
    }

    try {
      await API.post("/role-requests/request", {
        roleId: selectedRole,
      });

      enqueueSnackbar("Request submitted!", {
        variant: "success",
      });

      setAlreadyRequested(true); // ✅ instantly disable button
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Request failed",
        { variant: "error" }
      );
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Request Role
      </Typography>

      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>

          <Select
            value={selectedRole}
            label="Select Role"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.role_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleRequest}
          disabled={!selectedRole || alreadyRequested}
        >
          {alreadyRequested ? "Request Already Sent" : "Request Role"}
        </Button>
      </Box>
    </Paper>
  );
};

export default RoleRequest;