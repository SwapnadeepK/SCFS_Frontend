import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { getAdminDashboard } from "../../api/dashboardApi";

const AdminDashboard = () => {
  const [data, setData] = useState({
    summary: {},
    revenueTrend: [],
    paymentTrend: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {/* 🔹 SUMMARY CARDS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">
              {data.summary.totalUsers || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Payments</Typography>
            <Typography variant="h4">
              {data.summary.totalPayments || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">
              ₹ {data.summary.totalRevenue || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 📊 REVENUE CHART */}
      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Revenue Trend
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 📊 PAYMENTS CHART */}
      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Payment Trend
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.paymentTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AdminDashboard;