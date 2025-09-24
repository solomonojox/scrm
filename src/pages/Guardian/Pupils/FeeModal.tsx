import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { useAuth } from "../../../Context/Auth/useAuth";
import { toast } from "react-toastify";
import { paymentService } from "../../../Services/Payment";

interface Props {
  onClose: () => void;
  open: boolean;
  studentId: string; // single student ID
  classroomId: string;
  sessionId: string;
  paymentTerm: number;
}

const FeeModal: React.FC<Props> = ({
  open,
  onClose,
  studentId,
  classroomId,
  sessionId,
  paymentTerm,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // form state
  const [amount, setAmount] = useState<number | "">("");

  // submit handler
  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) return; // guard
    setLoading(true);

    const payload = {
      studentId,
      classroomId,
      sessionId,
      guardianId: user?.id, // from logged-in user
      amount: Number(amount),
      paymentTerm,
      schoolId: user?.schoolId,
    };

    try {
      const res = await paymentService.payStudentSchoolFee(payload);
      console.log("res", res.data);
      toast.success("Fees settled successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to settle fees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // validation
  const isAmountInvalid = !amount || Number(amount) <= 0;

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
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setAmount("");
              } else if (Number(val) >= 0) {
                // prevent negative numbers
                setAmount(Number(val));
              }
            }}
            type="number"
            variant="outlined"
            error={isAmountInvalid && amount !== ""}
            helperText={
              isAmountInvalid && amount !== "" ? "Enter a valid amount greater than 0" : ""
            }
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
            disabled={loading || isAmountInvalid}
            sx={{
              bgcolor: isAmountInvalid ? "grey.400" : "#F37021",
              color: "#fff",
              borderRadius: "8px",
              height: "50px",
              "&:hover": {
                bgcolor: isAmountInvalid ? "grey.500" : "#d85f1c",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeeModal;