import API from "./axios";

export const getColleges = () => API.get("/master/colleges");
export const getDepartments = () => API.get("/master/departments");
export const getDegrees = () => API.get("/master/degrees");
export const getSemesters = () => API.get("/master/semesters");