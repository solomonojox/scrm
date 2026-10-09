import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { User, Users, UserCheck, MoreVertical } from "lucide-react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { classroomService } from "../../Services/Classroom";

interface Student {
  studentId: string;
}



const calculateAge = (dob?: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const initials = (firstname?: string, lastname?: string) =>
  `${firstname?.charAt(0) ?? ""}${lastname?.charAt(0) ?? ""}`.toUpperCase() || "?";


export default function PupilsList({ classrooms }: any) {
  const navigate = useNavigate();
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null);

  // Handle menu open/close
  const handleMenuOpen = (event: any, student: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  // Pagination handlers
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // View / Delete / Messaging actions
  const handleViewStudent = () => {
    // console.log(selectedStudent)
    navigate(`/teacher/pupil/${selectedStudent.studentId}`, { state: selectedStudent });
    handleMenuClose();
  };

  const handleMessaging = () => {
    console.log("Messaging student:", selectedStudent);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Delete student:", selectedStudent);
    handleMenuClose();
  };

  // Fetch students by selected classroom
  const handleClassroomChange = async (selectedOption: any) => {
    setSelectedClassroom(selectedOption);
    if (!selectedOption) return;

    try {
      setLoading(true);
      const response = await classroomService.getClassroomTudentsByClassId(
        selectedOption.value
      );
      setStudents(response || []); // Adjust if your API shape differs
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Pupils Table */}
      <Box>
        <Paper sx={{ borderRadius: 3, boxShadow: 4, overflow: "hidden" }}>
          {/* Header with icons */}
          <Box
            sx={{
              bgcolor: "#EE7306",
              color: "white",
              px: 2,
              py: 2,
              fontWeight: 600,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              {/* <Box display="flex" gap={2}>
                <FolderIcon
                  onClick={() => setOpenFolderModal(true)}
                  sx={{ cursor: "pointer" }}
                />
                <InsertDriveFileIcon
                  onClick={() => setOpenDownloadModal(true)}
                  sx={{ cursor: "pointer" }}
                />
              </Box> */}
              All Pupils 
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {/* Search Input */}
              <TextField
                size="small"
                placeholder="Search students..."
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": { height: "36px" },
                }}
              />

              {/* Classroom Select */}
              <Box sx={{ minWidth: 200 }}>
                <Select
                  placeholder="Select Classroom"
                  options={classrooms?.map((cls: any) => ({
                    label: cls.name,
                    value: cls.classroomId,
                  }))}
                  value={selectedClassroom}
                  onChange={handleClassroomChange}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 36,
                      minHeight: 36,
                      borderRadius: 6,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? 'gray' : '#F07A00',
                      // or for different states:
                      // backgroundColor: state.isSelected ? '#selectedColor' : state.isFocused ? '#hoverColor' : '#defaultColor',
                    }),
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={5}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Student No.</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {students.length === 0
                          ? "No students found"
                          : "No students match your search"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    students
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((pupil: any, idx: number) => {
                        const age = calculateAge(pupil.dateOfBirth);
                        return (
                          <TableRow key={pupil.studentId ?? idx} hover>
                            <TableCell padding="checkbox">
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={pupil.studentNo || "—"}
                                size="small"
                                sx={{ bgcolor: "#FDE7D3", color: "#EE7306", fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: "#EE7306", fontSize: 14 }}>
                                {initials(pupil.firstname, pupil.lastname)}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2">
                                  {pupil.firstname} {pupil.lastname}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {pupil.dateOfBirth
                                    ? `DOB: ${pupil.dateOfBirth.split("T")[0]}`
                                    : "DOB: N/A"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {selectedClassroom?.label || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {age !== null ? `${age} yrs` : "N/A"}
                                </Typography>
                                {/* <Typography variant="caption" color="textSecondary">
                                  {pupil.gender || "N/A"}
                                </Typography> */}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                {/* <Typography variant="body2">
                                  {pupil.currentTerm || "N/A"}
                                </Typography> */}
                                <Typography variant="caption" color="textSecondary">
                                  {pupil.currentSession || "N/A"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={(e) => handleMenuOpen(e, pupil)}>
                                <MoreVertical size={16} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleViewStudent}>
          <UserCheck size={16} style={{ marginRight: 8 }} />
          View Student
        </MenuItem>
        {/* <MenuItem onClick={handleMessaging}>
          <Users size={16} style={{ marginRight: 8 }} />
          Messaging
        </MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <User size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Folder Modal */}
      <Dialog open={openFolderModal} onClose={() => setOpenFolderModal(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            label="Folder Name"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFolderModal(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log("New Folder:", folderName);
              setOpenFolderModal(false);
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Modal */}
      <Dialog
        open={openDownloadModal}
        onClose={() => setOpenDownloadModal(false)}
      >
        <DialogTitle>Download Files</DialogTitle>
        <DialogContent>
          <Typography>Simulate downloading pupil records...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDownloadModal(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log("Downloading...");
              setOpenDownloadModal(false);
            }}
            variant="contained"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
