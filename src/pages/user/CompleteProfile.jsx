import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useSnackbar } from "notistack";

import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

//const aadharRegex = /^[0-9]{12}$/;

const steps = ["Basic Info", "Role Details", "Finish"];

const CompleteProfile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);

  // IMPORTANT: default null prevents wrong UI flash
  const [role, setRole] = useState(null);

  const [age, setAge] = useState(null);
  const [ageWarningOpen, setAgeWarningOpen] = useState(false);

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [aadharError, setAadharError] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    phone: "",
    address: "",
    gender: "Male",
    aadhar_number: "",
    photo_uri: "https://ui-avatars.com/api/?name=User&background=random",

    college_id: "",
    department_id: "",
    degree_id: "",
    semester_id: "",
    batch_year: "",
    usn: "",
    designation: "",
  });

  /* ---------------- AGE ---------------- */
  const calculateAge = (dob) => {
    if (!dob) return null;

    const birth = new Date(dob);
    const today = new Date();

    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      a--;
    }

    return a;
  };

  /* ---------------- ROLE ---------------- */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get("/users/profile/status");

        const raw =
          res.data?.type ||
          res.data?.role ||
          res.data?.data?.type ||
          res.data?.data?.role ||
          "";

        const normalized = raw.toUpperCase();

        // ONLY valid roles allowed
        if (normalized === "STUDENT") setRole("STUDENT");
        else if (["STAFF", "PROFESSOR", "PRINCIPAL"].includes(normalized))
          setRole("STAFF");
        else setRole("UNKNOWN");
      } catch (err) {
        console.warn("Role fetch failed");
        setRole("UNKNOWN");
      }
    };

    fetchStatus();
  }, []);

  /* ---------------- DROPDOWNS ---------------- */
  useEffect(() => {
    const fetchDropdowns = async () => {
  try {
    setLoadingDropdowns(true);

    const [c, d, de, s] = await Promise.all([
      API.get("/master/colleges"),
      API.get("/master/departments"),
      API.get("/master/degrees"),
      API.get("/master/semesters"),
    ]);

    setColleges(c?.data?.data ?? c?.data ?? []);
    setDepartments(d?.data?.data ?? d?.data ?? []);
    setDegrees(de?.data?.data ?? de?.data ?? []);
    setSemesters(s?.data?.data ?? s?.data ?? []);
  } catch (err) {
    console.error("Dropdown fetch error:", err);
    enqueueSnackbar("Failed to load dropdown data", { variant: "error" });
  } finally {
    setLoadingDropdowns(false);
  }
};

    fetchDropdowns();
  }, [enqueueSnackbar]);

  /* ---------------- HANDLE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

     // Aadhaar validation block
  if (name === "aadhar_number") {
    // allow only digits while typing
    if (value && !/^\d*$/.test(value)) return;

    // optional: limit input length to 12
    if (value.length > 12) return;
  }

    setForm((p) => ({ ...p, [name]: value }));

    if (name === "dob") {
      const computed = calculateAge(value);
      setAge(computed);

      if (computed !== null && computed < 18) {
        setAgeWarningOpen(true);
      }
    }
  };

  const next = () => setActiveStep((p) => p + 1);
  const back = () => setActiveStep((p) => p - 1);

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
  const validAadhar = /^[0-9]{12}$/.test(form.aadhar_number);

  if (!validAadhar) {
    enqueueSnackbar("Invalid Aadhaar number", { variant: "error" });
    return;
  }

  if (age !== null && age < 18) {
    enqueueSnackbar("You must be 18+ to complete profile", {
      variant: "error",
    });
    return;
  }

  try {
    await API.post("/users/profile/complete", form);

    enqueueSnackbar("Profile completed successfully", {
      variant: "success",
    });

    window.location.href = "/login";
  } catch (err) {
    enqueueSnackbar(
      err?.response?.data?.message || "Failed to save profile",
      { variant: "error" }
    );
  }
};

  /* ---------------- VALIDATION GUARD ---------------- */
  const validateAadhar = () => {
  if (!form.aadhar_number) return;

  const valid = /^[0-9]{12}$/.test(form.aadhar_number);
  setAadharError(!valid);

  if (!valid) {
    enqueueSnackbar("Aadhaar must be exactly 12 digits", {
      variant: "error",
    });
  }
};

  /* ---------------- LOADING GUARD (FIX FOR INFINITE LOOP) ---------------- */
  if (role === null) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography mt={2}>Loading profile...</Typography>
      </Box>
    );
  }

  const isStudent = role === "STUDENT";

  /* ---------------- UI ---------------- */
  return (
    <Paper
      elevation={6}
      sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 5, borderRadius: 3 }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Complete Your Profile
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Divider sx={{ my: 3 }} />

      {/* STEP 1 */}
      {activeStep === 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            name="full_name"
            label="Full Name"
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="phone"
            label="Phone"
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="address"
            label="Address"
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            name="aadhar_number"
            label="Aadhar Number"
            value={form.aadhar_number}
            onChange={handleChange}
            onBlur={validateAadhar}
            error={aadharError}
            helperText={
              aadharError ? "Aadhaar must be 12 digits (numbers only)" : ""
            }
            fullWidth
            />
        </Box>
      )}

      {/* STEP 2 */}
      {activeStep === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">
            {isStudent ? "Student Details" : "Staff Details"}
          </Typography>

          {loadingDropdowns && <CircularProgress size={24} />}

          {isStudent ? (
            <>
              <TextField
                name="usn"
                label="USN"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="batch_year"
                label="Batch Year"
                onChange={handleChange}
                fullWidth
              />

              <TextField
                select
                name="college_id"
                label="College"
                onChange={handleChange}
                fullWidth
              >
                {colleges.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.college_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="department_id"
                label="Department"
                onChange={handleChange}
                fullWidth
              >
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.department_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="degree_id"
                label="Degree"
                onChange={handleChange}
                fullWidth
              >
                {degrees.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.degree_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="semester_id"
                label="Semester"
                onChange={handleChange}
                fullWidth
              >
                {semesters.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.semester_name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          ) : (
            <>
              <TextField
                name="designation"
                label="Designation"
                onChange={handleChange}
                fullWidth
              />

              <TextField
                select
                name="college_id"
                label="College"
                onChange={handleChange}
                fullWidth
              >
                {colleges.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.college_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="department_id"
                label="Department"
                onChange={handleChange}
                fullWidth
              >
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.department_name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </Box>
      )}

      {/* STEP 3 */}
      {/* STEP 3 - REVIEW */}
{activeStep === 2 && (
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" mb={2}>
      Review & Submit
    </Typography>

    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      
      {/* BASIC INFO */}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Basic Information
      </Typography>

      <Typography><b>Name:</b> {form.full_name || "-"}</Typography>
      <Typography><b>DOB:</b> {form.dob || "-"}</Typography>
      <Typography><b>Age:</b> {age ?? "-"}</Typography>
      <Typography><b>Phone:</b> {form.phone || "-"}</Typography>
      <Typography><b>Address:</b> {form.address || "-"}</Typography>
      <Typography><b>Gender:</b> {form.gender || "-"}</Typography>
      <Typography><b>Aadhar:</b> {form.aadhar_number || "-"}</Typography>

      <Divider sx={{ my: 2 }} />

      {/* ROLE INFO */}
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {role === "STUDENT" ? "Student Details" : "Staff Details"}
      </Typography>

      {role === "STUDENT" ? (
        <>
          <Typography><b>USN:</b> {form.usn || "-"}</Typography>
          <Typography><b>Batch Year:</b> {form.batch_year || "-"}</Typography>

          <Typography>
            <b>College:</b>{" "}
            {colleges.find(c => c.id === form.college_id)?.college_name || "-"}
          </Typography>

          <Typography>
            <b>Department:</b>{" "}
            {departments.find(d => d.id === form.department_id)?.department_name || "-"}
          </Typography>

          <Typography>
            <b>Degree:</b>{" "}
            {degrees.find(d => d.id === form.degree_id)?.degree_name || "-"}
          </Typography>

          <Typography>
            <b>Semester:</b>{" "}
            {semesters.find(s => s.id === form.semester_id)?.semester_name || "-"}
          </Typography>
        </>
      ) : (
        <>
          <Typography><b>Designation:</b> {form.designation || "-"}</Typography>

          <Typography>
            <b>College:</b>{" "}
            {colleges.find(c => c.id === form.college_id)?.college_name || "-"}
          </Typography>

          <Typography>
            <b>Department:</b>{" "}
            {departments.find(d => d.id === form.department_id)?.department_name || "-"}
          </Typography>
        </>
      )}
    </Paper>
  </Box>
)}

      {/* BUTTONS */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={back}>
          Back
        </Button>

        {activeStep < 2 ? (
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={submit}>
            Submit Profile
          </Button>
        )}
      </Box>

      {/* AGE WARNING */}
      <Dialog open={ageWarningOpen} onClose={() => setAgeWarningOpen(false)}>
        <DialogTitle>Age Restriction Notice</DialogTitle>
        <DialogContent>
          <Typography>
            You are <b>{age}</b> years old. Users below 18 may have restrictions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAgeWarningOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CompleteProfile;