import API from "./axios"; // IMPORTANT

export const getUsers = (params) => {
  return API.get("/users", { params });
};

export const searchUsers = (params) => {
  return API.get("/users/search", { params });
};