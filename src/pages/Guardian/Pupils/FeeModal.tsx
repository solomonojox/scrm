import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { X } from "lucide-react";
import { useAuth } from "../../../Context/Auth/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { paymentService } from "../../../Services/Payment";

interface Props {
  onClose: () => void;
  open: boolean;
  studentId: string; // make this single instead of array if only one student
  classroomId: string;
  sessionId: string;
  paymentTerm: number;
}

const FeeModal: React.FC<Props> = ({ open, onClose, studentId, classroomId, sessionId, paymentTerm }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // form state
  const [amount, setAmount] = useState<number>(0);

  // handle submit
  const handleSubmit = async () => {
    setLoading(true);
    // build payload
    const payload = {
      studentId,
      classroomId,
      sessionId,
      guardianId: user?.id, // get from logged-in user
      amount,
      paymentTerm,
      schoolId: user?.schoolId
    };

    try {
      const res = await paymentService.payStudentSchoolFee(payload);
      console.log('res', res.data)
      toast.success("Fees settled successfully!");
      onClose();
    } catch (err) {
      toast.error(err ||"Failed to settle fees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          flexDirection: "column",
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
            borderTopRightRadius: "8px",
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
            Settle Fees Easily and Securely
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <X />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          <Typography sx={{ mb: 1 }}>Student ID</Typography>
          <TextField
            fullWidth
            value={studentId}
            disabled
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 1 }}
          />

          <Typography sx={{ mb: 1 }}>Classroom ID</Typography>
          <TextField
            fullWidth
            value={classroomId}
            disabled
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 1 }}
          />

          <Typography sx={{ mb: 1 }}>Session ID</Typography>
          <TextField
            fullWidth
            value={sessionId}
            disabled
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 1 }}
          />

          <Typography sx={{ mb: 1 }}>Amount</Typography>
          <TextField
            fullWidth
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 1 }}
          />

          <Typography sx={{ mb: 1 }}>Payment Terms</Typography>
          <TextField
            fullWidth
            value={paymentTerm}
            disabled
            // onChange={(e) => setPaymentTerms(e.target.value)}
            // placeholder="e.g. Monthly, Per term"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 1 }}
          />

          <Typography sx={{ mb: 1 }}>Guardian ID</Typography>
          <TextField
            fullWidth
            value={user?.id || ""}
            disabled
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "8px",
                height: "50px",
                "& fieldset": { borderColor: "#F37021" },
              },
            }}
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#F37021",
              color: "#fff",
              borderRadius: "8px",
              height: "50px",
              "&:hover": { bgcolor: "#d85f1c" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : "Pay Now"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeeModal;