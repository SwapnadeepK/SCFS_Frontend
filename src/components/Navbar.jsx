import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Box,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import useAuth from "../auth/useAuth";
import { getFees } from "../api/feesApi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [search, setSearch] = useState("");

  const openMenu = Boolean(anchorEl);
  const openNotif = Boolean(notifAnchor);

  const notifications = [
    "Fee payment successful",
    "New fee structure released",
    "Reminder: Pay before due date",
  ];

  const menu = {
    VTU_ADMIN: [
      { label: "Dashboard", path: "/admin" },
      { label: "Payments", path: "/admin/payments" },
      { label: "Reports", path: "/admin/reports" },
    ],
    STUDENT: [
      { label: "Dashboard", path: "/student" },
      { label: "Pay Fees", path: "/student/pay" },
    ],
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    enqueueSnackbar("Logged out successfully", { variant: "info" });
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await getFees({ search });

      navigate("/admin/payments", {
        state: { results: res.data },
      });

      enqueueSnackbar("Search completed", { variant: "success" });
    } catch {
      enqueueSnackbar("Search failed", { variant: "error" });
    }
  };

  return (
    <AppBar
  position="fixed"
  sx={{
    zIndex: (theme) => theme.zIndex.drawer + 1, // ✅ above sidebar
    background: "#1a237e",
  }}
>
      <Toolbar
        sx={{
          minHeight: "64px !important",
          display: "flex",
          alignItems: "center",
          px: 3,
          gap: 2,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
          onClick={() => navigate("/")}
        >
          VTU Smart Fees
        </Typography>

        {/* Center */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            gap: 2,
            minWidth: 0,
          }}
        >
          {user && (
            <TextField
              variant="outlined"   // ✅ IMPORTANT
              size="small"
              fullWidth            // ✅ prevent weird DOM layout
              placeholder="Search fees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                maxWidth: 300,
              }}
              InputProps={{
                sx: { pr: 0.5 }, // spacing fix
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleSearch}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {user &&
            menu[user.role]?.map((m, i) => (
              <Button
                key={i}
                color="inherit"
                sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                onClick={() => navigate(m.path)}
              >
                {m.label}
              </Button>
            ))}
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user && (
            <>
              <IconButton
                color="inherit"
                onClick={(e) => setNotifAnchor(e.currentTarget)}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={notifAnchor}
                open={openNotif}
                onClose={() => setNotifAnchor(null)}
              >
                {notifications.map((note, i) => (
                  <MenuItem key={i}>{note}</MenuItem>
                ))}
              </Menu>
            </>
          )}

          {!user && (
            <>
              {/* <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button> */}
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </>
          )}

          {user && (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ bgcolor: "#ffca28", color: "#000" }}>
                  {user?.role?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem disabled>{user?.role}</MenuItem>
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;