import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ReportIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";

export const DEFAULT_ICON = <DashboardIcon />; // fallback
export const MENU_ICONS = {
  Dashboard: <DashboardIcon />,
  Payments: <PaymentIcon />,
  Reports: <ReportIcon />,
  Users: <PeopleIcon />,
  Roles: <SecurityIcon />,
  Permissions: <SecurityIcon />,
  Students: <SchoolIcon />,
  "Pay Fees": <PaymentIcon />,
};