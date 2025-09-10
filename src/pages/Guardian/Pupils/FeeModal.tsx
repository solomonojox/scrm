import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField
} from "@mui/material";
import { X } from "lucide-react";
import Select from "react-select";

interface Props {
  onClose: () => void;
  open: boolean;
}

const FeeModal: React.FC<Props> = ({ open, onClose }) => {
  const classroomOptions = [
    { value: "28983737338", label: "Classroom 1 (28983737338)" },
    { value: "28983737339", label: "Classroom 2 (28983737339)" }
  ];

  const sessionOptions = [
    { value: "110009383773", label: "2023/2024 (110009383773)" },
    { value: "110009383774", label: "2024/2025 (110009383774)" }
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 450 },
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          outline: "none",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#F37021",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            Settle Fees Easily and Securely
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <X />
          </IconButton>
        </Box>

        {/* Scrollable Body */}
        <Box
          sx={{
            p: 3,
            overflowY: "auto"
          }}
        >
          <Typography sx={{ mb: 1 }}>Student ID</Typography>
          <TextField
            fullWidth
            defaultValue="1233u4i4oo4o"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#F37021" },
                "&:hover fieldset": { borderColor: "#F37021" },
                "&.Mui-focused fieldset": { borderColor: "#F37021" }
              }
            }}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ mb: 1 }}>Classroom ID</Typography>
          <Select
            options={classroomOptions}
            defaultValue={classroomOptions[0]}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#F37021",
                borderRadius: "8px",
                "&:hover": { borderColor: "#F37021" }
              })
            }}
          />

          <Box sx={{ mb: 3 }} />

          <Typography sx={{ mb: 1 }}>Session ID</Typography>
          <Select
            options={sessionOptions}
            defaultValue={sessionOptions[0]}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#F37021",
                borderRadius: "8px",
                "&:hover": { borderColor: "#F37021" }
              })
            }}
          />

          <Box sx={{ mb: 3 }} />

          <Typography sx={{ mb: 1 }}>Amount</Typography>
          <TextField
            fullWidth
            defaultValue={0}
            type="number"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#F37021" },
                "&:hover fieldset": { borderColor: "#F37021" },
                "&.Mui-focused fieldset": { borderColor: "#F37021" }
              }
            }}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ mb: 1 }}>Payment Terms</Typography>
          <TextField
            fullWidth
            placeholder="e.g. Monthly, Per term"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#F37021" },
                "&:hover fieldset": { borderColor: "#F37021" },
                "&.Mui-focused fieldset": { borderColor: "#F37021" }
              }
            }}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ mb: 1 }}>Guardian ID</Typography>
          <TextField
            fullWidth
            defaultValue="38839837662"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                "& fieldset": { borderColor: "#F37021" },
                "&:hover fieldset": { borderColor: "#F37021" },
                "&.Mui-focused fieldset": { borderColor: "#F37021" }
              }
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default FeeModal;