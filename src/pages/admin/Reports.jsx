import { useEffect, useState, useCallback } from "react";
import {
  Card, CardContent, Typography,
  Grid, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from "recharts";

import { getReports } from "../../api/feesApi";

const COLORS = ["#4caf50", "#ff9800"];

const Reports = () => {
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const [filters, setFilters] = useState({
    academic_year: "",
    semester_id: ""
  });

  // ✅ FETCH REPORTS
  const fetchReports = useCallback(() => {
    getReports(filters)
      .then(res => {
        const data = res.data;

        setStats(data.summary || {});
        setRevenueData(data.monthlyRevenue || []);
        setPaymentData(data.paymentTrend || []);
        setDepartmentData(data.departmentStats || []);
      })
      .catch(err => {
        console.error("Reports error:", err);
      });
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ✅ PIE DATA
  const pieData = [
    { name: "Paid", value: stats.paid || 0 },
    { name: "Pending", value: stats.pending || 0 }
  ];

  return (
    <div>

      {/* 🎯 FILTERS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.academic_year}
              label="Year"
              onChange={(e) =>
                setFilters({ ...filters, academic_year: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl size="small">
            <InputLabel>Semester</InputLabel>
            <Select
              value={filters.semester_id}
              label="Semester"
              onChange={(e) =>
                setFilters({ ...filters, semester_id: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Sem 1</MenuItem>
              <MenuItem value="2">Sem 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 📊 SUMMARY */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography>Total: {stats.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography color="green">Paid: {stats.paid || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography color="orange">Pending: {stats.pending || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📈 REVENUE CHART */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography>Monthly Revenue</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 PAYMENT COUNT */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography>Payment Count</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ff5722" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🏫 DEPARTMENT REVENUE */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography>Department-wise Revenue</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🏫 PAID vs PENDING (STACKED) */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography>Paid vs Pending by Department</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="paid" stackId="a" fill="#4caf50" />
              <Bar dataKey="pending" stackId="a" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🥧 PIE CHART */}
      <Card>
        <CardContent>
          <Typography>Payment Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default Reports;