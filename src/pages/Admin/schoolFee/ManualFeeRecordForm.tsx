import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Alert,
    Grid,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { SelectChangeEvent } from '@mui/material/Select';
import { StudentType } from '../../../Types/Student/studentTypes';
import { Guardian } from '../../../Types/Guardian/guardianTypes';
import { Session } from '../../../Types/sessionType';

// Types
interface Classroom {
    classroomId: string;
    schoolId: string;
    name: string;
    capacity: number;
    teacherId: string;
}

// interface Guardian {
//     guardianId: string;
//     name: string;
//     phone: string;
//     email: string;
//     // Add other fields as needed
// }

interface ManualFeeRecordData {
    studentId: string;
    classroomId: string;
    amount: number;
    paymentTermId: string;
    guardianId: string;
    sessionId: string;
}

interface ManualFeeRecordProps {
    onSubmit: (data: ManualFeeRecordData) => Promise<void>;
    students: StudentType[];
    classrooms: Classroom[];
    paymentTerms: string;
    guardians?: Guardian[];
    isLoading?: boolean;
    schoolId: string;
    sessionId: Session[];
}

const ManualFeeRecordForm: React.FC<ManualFeeRecordProps> = ({
    onSubmit,
    students,
    classrooms,
    paymentTerms,
    guardians,
    isLoading = false,
    schoolId,
    sessionId
}) => {
    const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [filteredStudents, setFilteredStudents] = useState<StudentType[]>(students);
    const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ManualFeeRecordData>({
        defaultValues: {
            studentId: '',
            classroomId: '',
            sessionId: '',
            amount: 0,
            guardianId: ''
        }
    });

    const watchedStudentId = watch('studentId');
    const watchedClassroomId = watch('classroomId');
    const watchedGuardianId = watch('guardianId');

    // Filter students when classroom is selected
    useEffect(() => {
        if (watchedClassroomId) {
            const classroomStudents = students.filter(
                student => student.classroomId === watchedClassroomId
            );
            setFilteredStudents(classroomStudents);

            // Clear student selection if student is not in the selected classroom
            if (watchedStudentId && !classroomStudents.find(s => s.studentId === watchedStudentId)) {
                setValue('studentId', '');
                setSelectedStudent(null);
            }
        } else {
            setFilteredStudents(students);
        }
    }, [watchedClassroomId, students, watchedStudentId, setValue]);

    // Set selected student when studentId changes
    useEffect(() => {
        if (watchedStudentId) {
            const student = students.find(s => s.studentId === watchedStudentId);
            setSelectedStudent(student || null);

            // Auto-set guardianId if student has guardian
            if (student?.guardianId) {
                setValue('guardianId', student.guardianId);
            }
        } else {
            setSelectedStudent(null);
        }
    }, [watchedStudentId, students, setValue]);

    // Set selected classroom when classroomId changes
    useEffect(() => {
        if (watchedClassroomId) {
            const classroom = classrooms.find(c => c.classroomId === watchedClassroomId);
            setSelectedClassroom(classroom || null);
        } else {
            setSelectedClassroom(null);
        }
    }, [watchedClassroomId, classrooms]);

    // Filter guardians based on selected student
    useEffect(() => {
        if (guardians && selectedStudent) {
            const studentGuardian = guardians.find(g => g.guardianId === selectedStudent.guardianId);
            if (studentGuardian) {
                setFilteredGuardians([studentGuardian]);
            } else {
                setFilteredGuardians([]);
            }
        } else {
            setFilteredGuardians(guardians || []);
        }
    }, [selectedStudent, guardians]);

    const handleClassroomChange = (event: SelectChangeEvent) => {
        const classroomId = event.target.value;
        setValue('classroomId', classroomId);
    };

    const handleStudentChange = (event: SelectChangeEvent) => {
        const studentId = event.target.value;
        setValue('studentId', studentId);
    };

    const handleGuardianChange = (event: SelectChangeEvent) => {
        const guardianId = event.target.value;
        setValue('guardianId', guardianId);
    };

    const handleSessionChange = (event: SelectChangeEvent) => {
        const sessionId = event.target.value;
        setValue('sessionId', sessionId);
    };

    const handleFormSubmit = async (data: ManualFeeRecordData) => {
        // Add schoolId and sessionId from auth
        const formData = {
            ...data,
            schoolId,
            paymentTerms
        };

        await onSubmit(formData);
        reset();
        setSelectedStudent(null);
        setSelectedClassroom(null);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Record Manual Fee Payment
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={3}>
                    {/* Session Selection */}
                    <FormControl fullWidth error={!!errors.sessionId}>
                        <InputLabel id="session-select-label">Session</InputLabel>
                        <Controller
                            name="sessionId"
                            control={control}
                            rules={{ required: 'Session is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="session-select-label"
                                    label="Session"
                                    onChange={handleSessionChange}
                                    disabled={isLoading}
                                >
                                    {sessionId?.map((session) => (
                                        <MenuItem key={session.sessionId} value={session.sessionId}>
                                            {session.sessionId}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.sessionId && (
                            <Typography color="error" variant="caption">
                                {errors.sessionId.message}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Classroom Selection */}
                    <FormControl fullWidth error={!!errors.classroomId}>
                        <InputLabel id="classroom-select-label">Classroom</InputLabel>
                        <Controller
                            name="classroomId"
                            control={control}
                            rules={{ required: 'Classroom is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="classroom-select-label"
                                    label="Classroom"
                                    onChange={handleClassroomChange}
                                    disabled={isLoading}
                                >
                                    {classrooms?.map((classroom) => (
                                        <MenuItem key={classroom.classroomId} value={classroom.classroomId}>
                                            {classroom.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.classroomId && (
                            <Typography color="error" variant="caption">
                                {errors.classroomId.message}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Student Selection */}
                    {/* <Grid item xs={12} md={6}>
                    </Grid> */}
                    <FormControl fullWidth error={!!errors.studentId} disabled={!watchedClassroomId}>
                        <InputLabel id="student-select-label">Student</InputLabel>
                        <Controller
                            name="studentId"
                            control={control}
                            rules={{ required: 'Student is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="student-select-label"
                                    label="Student"
                                    onChange={handleStudentChange}
                                    disabled={!watchedClassroomId || isLoading}
                                >
                                    {filteredStudents?.map((student) => (
                                        <MenuItem key={student.studentId} value={student.studentId}>
                                            {student.firstname} {student.lastname}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.studentId && (
                            <Typography color="error" variant="caption">
                                {errors.studentId.message}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Guardian Selection */}
                    <FormControl fullWidth error={!!errors.guardianId}>
                        <InputLabel id="guardian-select-label">Guardian</InputLabel>
                        <Controller
                            name="guardianId"
                            control={control}
                            rules={{ required: 'Guardian is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="guardian-select-label"
                                    label="Guardian"
                                    onChange={handleGuardianChange}
                                    disabled={isLoading}
                                >
                                    {filteredGuardians.map((guardian) => (
                                        <MenuItem key={guardian.guardianId} value={guardian.guardianId}>
                                            {guardian.firstname} {guardian.lastname} ({guardian.phone})
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.guardianId && (
                            <Typography color="error" variant="caption">
                                {errors.guardianId.message}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Payment Term Selection */}
                    {/* <FormControl fullWidth error={!!errors.paymentTermId}>
                        <InputLabel id="payment-term-select-label">Payment Term</InputLabel>
                        <Controller
                            name="paymentTermId"
                            control={control}
                            rules={{ required: 'Payment term is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="payment-term-select-label"
                                    label="Payment Term"
                                    disabled={isLoading}
                                >
                                    {paymentTerms?.map((term) => (
                                        <MenuItem key={term.paymentTermId} value={term.paymentTermId}>
                                            {term.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.paymentTermId && (
                            <Typography color="error" variant="caption">
                                {errors.paymentTermId.message}
                            </Typography>
                        )}
                    </FormControl> */}

                    {/* Amount Input */}
                    <Controller
                        name="amount"
                        control={control}
                        rules={{
                            required: 'Amount is required',
                            min: { value: 1, message: 'Amount must be greater than 0' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Amount"
                                type="number"
                                fullWidth
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>
                                }}
                            />
                        )}
                    />

                    <div className='w-full'>
                        {/* Selected Student Information */}
                        {selectedStudent && (
                            // <Grid item xs={12}>
                            // </Grid>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Student Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Name:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedStudent.firstname} {selectedStudent.lastname}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Guardian:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedStudent.guardianName}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Guardian Phone:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedStudent.guardianPhone}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Classroom:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedStudent.classroomName}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit Button */}
                        {/* <Grid item xs={12}>
                    </Grid> */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => {
                                    reset();
                                    setSelectedStudent(null);
                                    setSelectedClassroom(null);
                                }}
                                disabled={isSubmitting || isLoading}
                            >
                                Clear
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting || isLoading}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                {isSubmitting ? 'Submitting...' : 'Record Payment'}
                            </Button>
                        </Box>
                    </div>
                </Grid>
            </form>

            {/* Loading State */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}
        </Paper>
    );
};

export default ManualFeeRecordForm;