import { Typography, Box } from "@mui/material";
import useAuth from "../auth/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Dashboard
      </Typography>

      <Typography variant="body1">
        Role: {user?.role}
      </Typography>
    </Box>
  );
};

export default Dashboard;