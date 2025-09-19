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
  TextField
} from "@mui/material";
import { User, Users, UserCheck } from "lucide-react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const pupils = Array(8).fill({
  id: "10001",
  firstName: "Owen",
  lastName: "Owen",
  enteredClass: "Jss1",
  dob: "22/2/2222",
  age: 12,
  guardianId: "122222222",
  teacherId: "22222222",
  gender: "Male",
  currentTerm: "1st Term",
  sessionId: "2025/2026",
  classroomId: "Jss1A",
  photo: "https://i.pravatar.cc/50?img=3"
});

export default function PupilDashboard() {
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  return (
    <Box p={4}>
      {/* Pupils Table */}
      <Box mt={5}>
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
              gap: 2
            }}
          >
            {/* Icons on left */}
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Photo</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Entered Class</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Guardian ID</TableCell>
                  <TableCell>Teacher ID</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Current Term</TableCell>
                  <TableCell>Session ID</TableCell>
                  <TableCell>Classroom ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pupils.map((pupil, idx) => (
                  <TableRow key={idx}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{pupil.id}</TableCell>
                    <TableCell>
                      <img
                        src={pupil.photo}
                        alt="student"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    </TableCell>
                    <TableCell>{pupil.firstName}</TableCell>
                    <TableCell>{pupil.lastName}</TableCell>
                    <TableCell>{pupil.enteredClass}</TableCell>
                    <TableCell>{pupil.dob}</TableCell>
                    <TableCell>{pupil.age}</TableCell>
                    <TableCell>{pupil.guardianId}</TableCell>
                    <TableCell>{pupil.teacherId}</TableCell>
                    <TableCell>{pupil.gender}</TableCell>
                    <TableCell>{pupil.currentTerm}</TableCell>
                    <TableCell>{pupil.sessionId}</TableCell>
                    <TableCell>{pupil.classroomId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box px={2} py={1.5} color="text.secondary" fontSize="0.9rem">
            Page 1 of 1
          </Box>
        </Paper>
      </Box>

      {/* Folder Modal */}
      <Dialog open={openFolderModal} onClose={() => setOpenFolderModal(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            label="Folder Name"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
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
