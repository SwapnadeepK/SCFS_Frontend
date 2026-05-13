import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useSnackbar } from "notistack";

import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("");
  const [roleData, setRoleData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile/me");

        console.log("PROFILE DATA:", res.data);

        setProfile(res.data.profile);     // ✅ correct
        setRole(res.data.role);           // ✅ correct
        setRoleData(res.data.roleData);   // ✅ correct
      } catch (err) {
        enqueueSnackbar("Failed to load profile", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [enqueueSnackbar]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return <Typography textAlign="center">No profile found</Typography>;
  }

  const calculateAge = (dob) => {
  if (!dob) return null;

  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
};

  const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 5 }}>
      <Typography variant="h5" mb={2}>
        My Profile
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* BASE PROFILE */}
      <Typography><b>Name:</b> {profile.full_name}</Typography>
      <Typography>
        <b>DOB:</b> {profile.dob ? formatDate(profile.dob) : "Not provided"}
        </Typography>
        <Typography>
        <b>Age:</b>{" "}
        {profile.dob ? `${calculateAge(profile.dob)} years` : "N/A"}
        </Typography>
      <Typography><b>Phone:</b> {profile.phone}</Typography>
      <Typography><b>Gender:</b> {profile.gender}</Typography>
      <Typography><b>Address:</b> {profile.address}</Typography>
      <Typography><b>Aadhar:</b> {profile.aadhar_number}</Typography>

      <Divider sx={{ my: 2 }} />

      {/* ROLE */}
      <Typography variant="h6">{role} Details</Typography>

      {/* STUDENT */}
      {role === "STUDENT" && (
        <>
          <Typography><b>USN:</b> {roleData.usn}</Typography>
          <Typography><b>Batch:</b> {roleData.batch_year}</Typography>

          <Typography><b>College:</b> {roleData.college}</Typography>
          <Typography><b>Department:</b> {roleData.department}</Typography>
          <Typography><b>Degree:</b> {roleData.degree}</Typography>
          <Typography><b>Semester:</b> {roleData.semester}</Typography>
        </>
      )}

      {/* STAFF */}
      {(role === "PROFESSOR" || role === "PRINCIPAL") && (
        <>
          <Typography><b>Designation:</b> {roleData.designation}</Typography>

          <Typography><b>College:</b> {roleData.college}</Typography>
          <Typography><b>Department:</b> {roleData.department}</Typography>
        </>
      )}

      {/* ADMIN */}
      {role === "VTU_ADMIN" && (
        <>
          <Typography><b>Office:</b> {roleData.office_name}</Typography>
          <Typography><b>Designation:</b> {roleData.designation}</Typography>
          <Typography><b>DOB:</b> {profile.dob || "Not provided"}</Typography>
        </>
      )}
    </Paper>
  );
};

export default Profile;