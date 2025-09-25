import React, { useState } from "react";
import { useAuth } from "../../../Context/Auth/useAuth";
import { guardianService } from "../../../Services/Guardian/guardian";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
} from "@mui/material";

const AccountSetup = () => {
    const { user } = useAuth();
    const [bvn, setBvn] = useState("");
    const [nin, setNin] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        // Basic validation for empty fields
        if (!bvn.trim()) {
            toast.error("BVN is required");
            return false;
        }
        if (!nin.trim()) {
            toast.error("NIN is required");
            return false;
        }
        // Optional: add length/format validation
        if (bvn.length !== 11) {
            toast.error("BVN must be 11 digits");
            return false;
        }
        if (nin.length < 8) {
            toast.error("NIN must be 10 digits");
            return false;
        }
        return true;
    };

    const submitAccount = async () => {
        if (!validateForm()) return;

        const payload = {
            guardianId: user?.id,
            bvn: bvn.trim(),
            nin: nin.trim(),
            schoolId: user?.schoolId,
        };

        try {
            setLoading(true);
            await guardianService.accountSetUp(payload);
            toast.success("Account set up successfully");
            setBvn("");
            setNin("");
        } catch (error: any) {
            console.error(error.response.data);
            const err = error.response.data
            toast.error(err === "An unexpected error occurred." ? "Please enter valid details" : "Failed to set up account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-[84dvh] flex justify-center items-center">
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Guardian Account Setup
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Please provide your BVN and NIN to complete your account setup.
                    </Typography>

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="BVN"
                            type="text"
                            value={bvn}
                            onChange={(e) => setBvn(e.target.value)}
                            required
                            inputProps={{ maxLength: 11 }}
                        />
                        <TextField
                            label="NIN"
                            type="text"
                            value={nin}
                            onChange={(e) => setNin(e.target.value)}
                            required
                        />

                        <Button
                            variant="contained"
                            // color="primary"
                            onClick={submitAccount}
                            disabled={loading}
                            sx={{
                                mt: 2, textTransform: "none", backgroundColor: "#F07A00", "&:hover": {
                                    backgroundColor: "#EE730699",
                                }
                            }}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default AccountSetup;