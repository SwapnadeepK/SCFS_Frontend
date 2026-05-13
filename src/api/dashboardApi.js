import API from "./axios";

export const getAdminDashboard = () => API.get("/dashboard/admin");