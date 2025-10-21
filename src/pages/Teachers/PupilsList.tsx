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
              <Box display="flex" gap={2}>
                <FolderIcon
                  onClick={() => setOpenFolderModal(true)}
                  sx={{ cursor: "pointer" }}
                />
                <InsertDriveFileIcon
                  onClick={() => setOpenDownloadModal(true)}
                  sx={{ cursor: "pointer" }}
                />
              </Box>
              All Pupils | All Folder
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
                    <TableCell>Student ID</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Age/Gender</TableCell>
                    <TableCell>Term/Session</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    students
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((pupil: any, idx: number) => (
                        <TableRow key={idx} hover>
                          <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={pupil.studentNo}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={pupil.photo}
                              alt="student"
                              sx={{ width: 40, height: 40 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2">
                                {pupil.firstname} {pupil.lastname}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                DOB: {pupil.dob}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {pupil.classroomId?.name || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {pupil.age || pupil.dateOfBirth?.slice(0, 10)}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {pupil.gender}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {pupil.currentTerm}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {pupil.sessionId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, pupil)}
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
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
        <MenuItem onClick={handleMessaging}>
          <Users size={16} style={{ marginRight: 8 }} />
          Messaging
        </MenuItem>
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
