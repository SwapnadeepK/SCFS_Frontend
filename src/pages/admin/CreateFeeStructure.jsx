import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";

import API from "../../api/axios";

import { useSnackbar } from "notistack";

const CreateFeeStructure = () => {
  const { enqueueSnackbar } =
    useSnackbar();

  const [loading, setLoading] =
    useState(false);

  const [tableLoading, setTableLoading] =
    useState(false);

  const [feeStructures, setFeeStructures] =
    useState([]);

  const [colleges, setColleges] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [degrees, setDegrees] =
    useState([]);

  const [semesters, setSemesters] =
    useState([]);

  const [form, setForm] = useState({
    college_id: "",
    department_id: "",
    degree_id: "",
    semester_id: "",
    academic_year: "",
    amount: "",
    due_date: "",
  });

  /* =========================================
     ACADEMIC YEARS
  ========================================= */
  const currentYear = new Date().getFullYear();

  const academicYears = [];

    for (
      let year = currentYear - 6;
      year <= currentYear;
      year++
    ) {
      academicYears.push(
        `${year}-${year + 1}`
      );
    }

  /* =========================================
     FETCH MASTER DATA
  ========================================= */
  const fetchMasters = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          collegesRes,
          departmentsRes,
          degreesRes,
          semestersRes,
        ] = await Promise.all([
          API.get("/master/colleges"),
          API.get("/master/departments"),
          API.get("/master/degrees"),
          API.get("/master/semesters"),
        ]);

        setColleges(
          Array.isArray(
            collegesRes?.data?.data
          )
            ? collegesRes.data.data
            : []
        );

        setDepartments(
          Array.isArray(
            departmentsRes?.data?.data
          )
            ? departmentsRes.data.data
            : []
        );

        setDegrees(
          Array.isArray(
            degreesRes?.data?.data
          )
            ? degreesRes.data.data
            : Array.isArray(
                  degreesRes?.data
                )
              ? degreesRes.data
              : []
        );

        setSemesters(
          Array.isArray(
            semestersRes?.data?.data
          )
            ? semestersRes.data.data
            : Array.isArray(
                  semestersRes?.data
                )
              ? semestersRes.data
              : []
        );
      } catch (err) {
        console.error(err);

        enqueueSnackbar(
          "Failed to load master data",
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  /* =========================================
     FETCH FEE STRUCTURES
  ========================================= */
  const fetchFeeStructures =
    useCallback(async () => {
      try {
        setTableLoading(true);

        const res = await API.get(
          "/fee-structures"
        );

        setFeeStructures(
          res?.data?.data || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setTableLoading(false);
      }
    }, []);

  /* =========================================
     INITIAL LOAD
  ========================================= */
  useEffect(() => {
    fetchMasters();
    fetchFeeStructures();
  }, [
    fetchMasters,
    fetchFeeStructures,
  ]);

  /* =========================================
   LOAD DEPARTMENTS
   WHEN COLLEGE CHANGES
    ========================================= */
    useEffect(() => {

      if (!form.college_id) {

        setDepartments([]);

        return;
      }

      fetchDepartments(
        form.college_id
      );

    }, [form.college_id]);

  /* =========================================
   HANDLE CHANGE
========================================= */
const handleChange = (e) => {

  const { name, value } =
    e.target;

  /* ==========================
     COLLEGE CHANGED
  ========================== */
  if (name === "college_id") {

    setForm((prev) => ({
      ...prev,

      college_id: value,

      // reset department
      department_id: "",
    }));

    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  /* =========================================
     SUBMIT
  ========================================= */
  const handleSubmit = async () => {
    try {
      if (
        !form.college_id ||
        !form.department_id ||
        !form.degree_id ||
        !form.semester_id ||
        !form.academic_year ||
        !form.amount ||
        !form.due_date
      ) {
        enqueueSnackbar(
          "Please fill all fields",
          {
            variant: "warning",
          }
        );

        return;
      }

      setLoading(true);

      await API.post(
        "/fee-structures",
        form
      );

      enqueueSnackbar(
        "Fee structure created successfully",
        {
          variant: "success",
        }
      );

      setForm({
        college_id: "",
        department_id: "",
        degree_id: "",
        semester_id: "",
        academic_year: "",
        amount: "",
        due_date: "",
      });

      fetchFeeStructures();
    } catch (err) {
      console.error(err);

      enqueueSnackbar(
        err?.response?.data
          ?.message ||
          "Failed to create fee structure",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     COMMON FIELD STYLE
  ========================================= */
  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      height: 62,
      fontSize: 15,
    },

    "& .MuiInputLabel-root": {
      fontSize: 15,
    },

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      minHeight: "unset !important",
    },
  };

  /* =========================================
     LOADING
  ========================================= */
  if (
    loading &&
    colleges.length === 0
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* =========================================
    RENDER FETCH DEPARTMENTS BASED ON SELECTED COLLEGE
  ========================================= */
  const fetchDepartments =
  async (collegeId) => {

    try {

      const res =
        await API.get(
          `/departments/college/${collegeId}`
        );

      setDepartments(
        res.data.data || []
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      {/* =========================================
          FORM CARD
      ========================================= */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
        >
          Create Fee Structure
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
        >
          Configure semester-wise fee
          structures.
        </Typography>

        {/* =========================================
            ROW 1
        ========================================= */}
        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}
        >
          {/* COLLEGE */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
                select
                fullWidth
                label="College"
                name="college_id"
                value={form.college_id}
                onChange={handleChange}
              >
                {colleges.map((college) => (
                  <MenuItem
                    key={college.id}
                    value={college.id}
                  >
                    {college.college_name}
                  </MenuItem>
                ))}
              </TextField>
              </Grid>

          {/* DEPARTMENT */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
                select
                fullWidth
                label="Department"
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                disabled={!form.college_id}
              >
                {departments.map((dept) => (
                  <MenuItem
                    key={dept.id}
                    value={dept.id}
                  >
                    {dept.department_name}
                  </MenuItem>
                ))}
              </TextField>
          </Grid>

          {/* DEGREE */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="Degree"
              name="degree_id"
              value={form.degree_id}
              onChange={handleChange}
              sx={fieldStyle}
            >
              {degrees.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.degree_name ||
                    item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* SEMESTER */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
          >
            <TextField
              select
              fullWidth
              variant="outlined"
              size="medium"
              label="Semester"
              name="semester_id"
              value={
                form.semester_id
              }
              onChange={handleChange}
              sx={fieldStyle}
            >
              {semesters.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >
                  {item.semester_name ||
                    item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* =========================================
            ROW 2
        ========================================= */}
        <Grid
          container
          spacing={3}
        >
          {/* ACADEMIC YEAR */}
          <Grid
            item
            xs={12}
            md={4}
          >
            <FormControl fullWidth>
                <InputLabel>
                  Academic Year
                </InputLabel>

                <Select
                    name="academic_year"
                    value={form.academic_year}
                    label="Academic Year"
                    onChange={handleChange}
                  >
                  {academicYears.map((year) => (
                    <MenuItem
                      key={year}
                      value={year}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Grid>

          {/* AMOUNT */}
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              type="number"
              label="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              sx={fieldStyle}
            />
          </Grid>

          {/* DUE DATE */}
          <Grid
            item
            xs={12}
            md={4}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="medium"
              type="date"
              label="Due Date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                ...fieldStyle,

                "& input[type='date']::-webkit-datetime-edit":
                  {
                    color:
                      form.due_date
                        ? "inherit"
                        : "transparent",
                  },

                "& input[type='date']:focus::-webkit-datetime-edit":
                  {
                    color: "inherit",
                  },

                "& input[type='date']::-webkit-calendar-picker-indicator":
                  {
                    opacity: 1,
                    cursor: "pointer",
                  },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              px: 5,
              py: 1.4,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {loading
              ? "Creating..."
              : "Create Fee Structure"}
          </Button>
        </Box>
      </Paper>

      {/* =========================================
          TABLE
      ========================================= */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom:
              "1px solid #eee",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Existing Fee Structures
          </Typography>
        </Box>

        {tableLoading ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    College
                  </TableCell>

                  <TableCell>
                    Department
                  </TableCell>

                  <TableCell>
                    Degree
                  </TableCell>

                  <TableCell>
                    Semester
                  </TableCell>

                  <TableCell>
                    Academic Year
                  </TableCell>

                  <TableCell>
                    Amount
                  </TableCell>

                  <TableCell>
                    Due Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {feeStructures.length >
                0 ? (
                  feeStructures.map(
                    (
                      item,
                      index
                    ) => (
                      <TableRow
                        key={index}
                        hover
                      >
                        <TableCell>
                          {
                            item.college_name
                          }
                        </TableCell>

                        <TableCell>
                          {
                            item.department_name
                          }
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              item.degree_name
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          {
                            item.semester_name
                          }
                        </TableCell>

                        <TableCell>
                          {
                            item.academic_year
                          }
                        </TableCell>

                        <TableCell>
                          ₹
                          {
                            item.amount
                          }
                        </TableCell>

                        <TableCell>
                        {new Date(item.due_date)
                          .toLocaleDateString("en-GB")}
                      </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                    >
                      No fee structures
                      found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default CreateFeeStructure;