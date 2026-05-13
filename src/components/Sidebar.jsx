import React, { useEffect, useState } from "react";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Link,
  useLocation,
} from "react-router-dom";

import useAuth from "../auth/useAuth";

import { getRoleMenu } from "../api/menuApi";

import {
  Dashboard,
  Payments,
  ReceiptLong,
  Verified,
  Group,
  Security,
  Assignment,
  School,
  AccountBalanceWallet,
  AdminPanelSettings,
} from "@mui/icons-material";

/* =====================================
   DRAWER WIDTH
===================================== */
export const drawerWidth = 250;

/* =====================================
   ICON MAP
===================================== */
const MENU_ICONS = {
  Dashboard: <Dashboard />,

  Payments: <Payments />,

  "Pay Fees": <Payments />,

  "My Fees": <Assignment />,

  Transactions: <ReceiptLong />,

  "Fee Approvals": <Verified />,

  "Fee Structures":
    <AccountBalanceWallet />,

  Reports: <ReceiptLong />,

  Users: <Group />,

  Roles: <Security />,

  "Role Requests":
    <AdminPanelSettings />,

  Students: <School />,
};

const DEFAULT_ICON = <Dashboard />;

const Sidebar = () => {
  const { user } = useAuth();

  const location = useLocation();

  const [menu, setMenu] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =====================================
     FETCH MENU
  ===================================== */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (!user?.role) {
          setLoading(false);
          return;
        }

        const res = await getRoleMenu(
          user.role
        );

        const menuData =
          Array.isArray(res?.data)
            ? res.data
            : [];

        /* REMOVE DUPLICATES */
        const seen = new Set();

        const uniqueMenu = menuData.filter(
          (item) => {
            if (
              !item?.path ||
              seen.has(item.path)
            ) {
              return false;
            }

            seen.add(item.path);

            return true;
          }
        );

        setMenu(uniqueMenu);
      } catch (err) {
        console.error(
          "Sidebar menu error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [user?.role]);

  /* =====================================
     ACTIVE ROUTE
  ===================================== */
  const isRouteActive = (path) => {
    if (!path) return false;

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };

  return (
    <Drawer
  variant="permanent"
  sx={{
    flexShrink: 0,

    "& .MuiDrawer-paper": {
      width: drawerWidth,

      boxSizing: "border-box",

      top: "64px",

      height: "calc(100vh - 64px)",

      borderRight:
        "1px solid #e5e7eb",

      backgroundColor: "#fff",

      overflowX: "hidden",

      overflowY: "auto",
    },
  }}
>
      {/* HEADER */}
      <Box
        sx={{
          p: 2,

          borderBottom:
            "1px solid #eee",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
        >
          College ERP
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          {user?.role || "USER"}
        </Typography>
      </Box>

      {/* LOADER */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          mt={5}
        >
          <CircularProgress size={28} />
        </Box>
      ) : (
        <List sx={{ p: 1 }}>
          {/* EMPTY */}
          {menu.length === 0 && (
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              mt={3}
            >
              No menu items found
            </Typography>
          )}

          {/* MENU ITEMS */}
          {menu.map((item) => {
            const isActive =
              isRouteActive(item.path);

            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  px: 2,
                  py: 1.2,

                  borderRadius: 2,

                  mb: 0.5,

                  transition: "0.2s",

                  "& .MuiListItemIcon-root":
                    {
                      color: "#555",
                    },

                  "&:hover": {
                    backgroundColor:
                      "#f5f5f5",
                  },

                  "&.Mui-selected": {
                    backgroundColor:
                      "#1976d2",

                    color: "#fff",

                    "& .MuiListItemIcon-root":
                      {
                        color: "#fff",
                      },

                    "&:hover": {
                      backgroundColor:
                        "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                  }}
                >
                  {MENU_ICONS[
                    item.name
                  ] || DEFAULT_ICON}
                </ListItemIcon>

                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    noWrap: true,

                    fontWeight:
                      isActive
                        ? 600
                        : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;