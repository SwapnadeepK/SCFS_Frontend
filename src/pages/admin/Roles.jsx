import { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Chip
} from "@mui/material";

import { useSnackbar } from "notistack";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [roleMenu, setRoleMenu] = useState([]);
  const [selectedRoleForMenu, setSelectedRoleForMenu] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  /* ---------------- SAFE HELPERS ---------------- */

  const getRoleName = (role) =>
    role?.name || role?.role_name || role?.role || "Unknown";

  const getPermissions = (role) =>
    role?.permissions || role?.permission || [];

  /* ---------------- FETCH ROLES ---------------- */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/roles");

      // FIX: backend may return array OR {data: array}
      const data = res.data?.data || res.data || [];

      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch roles",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data?.data || []);
    } catch (err) {
      enqueueSnackbar("Failed to fetch users", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  /* ---------------- ASSIGN ROLE ---------------- */
  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      enqueueSnackbar("Select user and role", { variant: "warning" });
      return;
    }

    try {
      await API.post("/roles/assign", {
        user_id: selectedUser,
        role_id: selectedRole
      });

      enqueueSnackbar("Role assigned successfully", { variant: "success" });

      setSelectedUser("");
      setSelectedRole("");

      fetchRoles();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to assign role",
        { variant: "error" }
      );
    }
  };

  /* ---------------- FETCH ROLE MENU ---------------- */
  const fetchRoleMenu = async (role) => {
    try {
      // FIX: backend expects role NAME, NOT ID
      const roleKey = getRoleName(role);

      const res = await API.get(`/roles/${roleKey}/menu`);

      setRoleMenu(res.data?.data || res.data || []);
      setSelectedRoleForMenu(roleKey);
    } catch (err) {
      enqueueSnackbar("Failed to fetch role menu", { variant: "error" });
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  /* ---------------- UI ---------------- */
  return (
    <Paper sx={{ p: 3 }}>

      <Typography variant="h5" gutterBottom>
        Roles Management
      </Typography>

      {/* ASSIGN ROLE */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            label="User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            label="Role"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {getRoleName(r)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={assignRole}>
          Assign Role
        </Button>

      </Box>

      {/* LOADING */}
      {loading ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id} hover>

                  <TableCell>{role.id}</TableCell>

                  <TableCell>
                    <Chip
                      label={getRoleName(role)}
                      color="primary"
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {getPermissions(role).length > 0 ? (
                      getPermissions(role).map((p, i) => (
                        <Chip
                          key={i}
                          label={p}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      "No permissions"
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => fetchRoleMenu(role)}
                    >
                      View Menu
                    </Button>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      )}

      {/* ROLE MENU */}
      {roleMenu.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Menu for Role: {selectedRoleForMenu}
          </Typography>

          {roleMenu.map((item, i) => (
            <Chip key={i} label={item.name} sx={{ m: 0.5 }} />
          ))}
        </Box>
      )}

    </Paper>
  );
};

export default Roles;