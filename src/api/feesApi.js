import API from "./axios";

// ✅ KEEP ONLY ONE getFees
export const getFees = (params) =>
  API.get("/fees", { params });

export const payFees = (data) =>
  API.post("/fees/pay", data);

export const addFee = (data) =>
  API.post("/fees/add", data);

export const getReports = (params) =>
  API.get("/fees/reports", { params });