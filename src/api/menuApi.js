import API from "./axios";

export const getRoleMenu = (role) => {
  return API.get(`/roles/${role}/menu`);
};