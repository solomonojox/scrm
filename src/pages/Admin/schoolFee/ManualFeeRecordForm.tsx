import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { StudentType } from '../../../Types/Student/studentTypes';
import { Guardian } from '../../../Types/Guardian/guardianTypes';
import { Session } from '../../../Types/sessionType';
import { paymentService } from '../../../Services/Payment';

interface Classroom {
  classroomId: string;
  schoolId: string;
  name: string;
  capacity: number;
  teacherId: string;
}

export interface PaymentTerm {
  paymentTermId: string;
  name: string;
}

// What the parent receives on submit
interface ManualFeeRecordData {
  studentId: string;
  classroomId: string;
  amount: number;
  paymentTermId: string;
  guardianId: string;
  sessionId: string;
  schoolId: string;
}

// Internal form state: amount can be '' while the user is typing/clearing the field
interface FormValues extends Omit<ManualFeeRecordData, 'amount' | 'schoolId'> {
  amount: number | '';
}

interface ManualFeeRecordProps {
  onSubmit: (data: ManualFeeRecordData) => Promise<void>;
  students: StudentType[];
  classrooms: Classroom[];
  paymentTerms: PaymentTerm[];
  guardians?: Guardian[];
  isLoading?: boolean;
  schoolId: string;
  sessionId: Session[]; // prop name kept so existing callers don't break
}

const DEFAULT_VALUES: FormValues = {
  studentId: '',
  classroomId: '',
  sessionId: '',
  paymentTermId: '',
  guardianId: '',
  amount: ''
};

const formatNaira = (value: number) => `₦${value.toLocaleString('en-NG')}`;

// Adjust to whichever field your Session type uses for a readable label
const getSessionLabel = (session: Session): string => {
  const s = session as unknown as Record<string, unknown>;
  return String(s.name ?? s.sessionName ?? session.sessionId);
};

const ManualFeeRecordForm: React.FC<ManualFeeRecordProps> = ({
  onSubmit,
  students,
  classrooms,
  paymentTerms,
  guardians,
  isLoading = false,
  schoolId,
  sessionId: sessions // renamed locally: it's a list of sessions, and it no longer shadows other `sessionId`s
}) => {
  const [classroomAmount, setClassroomAmount] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  });

  const watchedStudentId = watch('studentId');
  const watchedClassroomId = watch('classroomId');
  const watchedSessionId = watch('sessionId');
  const watchedTermId = watch('paymentTermId');

  const busy = isLoading || isSubmitting;

  /* ---------- Derived data (no effect + state needed) ---------- */

  const filteredStudents = useMemo(
    () =>
      watchedClassroomId
        ? students.filter((s) => s.classroomId === watchedClassroomId)
        : [],
    [students, watchedClassroomId]
  );

  const selectedStudent = useMemo(
    () => students.find((s) => s.studentId === watchedStudentId) ?? null,
    [students, watchedStudentId]
  );

  // If the student's guardian is found, show only them; otherwise fall back to all
  // guardians so the required field can never get stuck with an empty list.
  const guardianOptions = useMemo(() => {
    const all = guardians ?? [];
    if (selectedStudent?.guardianId) {
      const match = all.filter((g) => g.guardianId === selectedStudent.guardianId);
      if (match.length) return match;
    }
    return all;
  }, [guardians, selectedStudent]);

  /* ---------- Auto-select the only payment term ---------- */

  useEffect(() => {
    if (paymentTerms?.length === 1 && !watchedTermId) {
      setValue('paymentTermId', paymentTerms[0].paymentTermId, { shouldValidate: true });
    }
  }, [paymentTerms, watchedTermId, setValue]);

  /* ---------- Fetch the fee and pre-fill the (editable) amount ---------- */

  useEffect(() => {
    if (!watchedClassroomId || !watchedSessionId || !watchedTermId) {
      setClassroomAmount(null);
      setFeeError(null);
      return;
    }

    let cancelled = false; // ignore stale responses if the selection changes mid-request

    const loadFee = async () => {
      setFeeLoading(true);
      setFeeError(null);
      try {
        const res = await paymentService.getSchoolFeeByClassroomAndSession(
          watchedClassroomId,
          watchedSessionId,
          watchedTermId
        );
        if (cancelled) return;

        const fee = Number(res?.data);
        if (!Number.isFinite(fee)) throw new Error('Invalid fee returned');

        setClassroomAmount(fee);
        // Pre-fill with the full fee; the user can still lower it for part payments
        setValue('amount', fee, { shouldValidate: true, shouldDirty: true });
      } catch (error) {
        if (cancelled) return;
        console.error('Error fetching classroom amount:', error);
        setClassroomAmount(null);
        setValue('amount', '');
        setFeeError(
          'Could not load the fee for this classroom, session and term. Enter the amount manually.'
        );
      } finally {
        if (!cancelled) setFeeLoading(false);
      }
    };

    loadFee();
    return () => {
      cancelled = true;
    };
  }, [watchedClassroomId, watchedSessionId, watchedTermId, setValue]);

  /* ---------- Handlers ---------- */

  const handleClear = () => {
    reset(DEFAULT_VALUES);
    setClassroomAmount(null);
    setFeeError(null);
    setSubmitError(null);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      await onSubmit({
        ...data,
        amount: Number(data.amount),
        schoolId
      });
      handleClear();
    } catch (error) {
      console.error('Error recording payment:', error);
      setSubmitError('Payment could not be recorded. Please check the details and try again.');
    }
  };

  /* ---------- Render ---------- */

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', mx: 'auto', position: 'relative' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'orange' }}>
        Record Manual Fee Payment
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
          }}
        >
          {/* Session */}
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
                  disabled={busy}
                >
                  {sessions?.map((session) => (
                    <MenuItem key={session.sessionId} value={session.sessionId}>
                      {getSessionLabel(session)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.sessionId && <FormHelperText>{errors.sessionId.message}</FormHelperText>}
          </FormControl>

          {/* Payment term */}
          <FormControl fullWidth error={!!errors.paymentTermId}>
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
                  disabled={busy}
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
              <FormHelperText>{errors.paymentTermId.message}</FormHelperText>
            )}
          </FormControl>

          {/* Classroom */}
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
                  disabled={busy}
                  onChange={(e) => {
                    field.onChange(e);
                    // A different classroom invalidates the student and guardian choice
                    setValue('studentId', '');
                    setValue('guardianId', '');
                  }}
                >
                  {classrooms?.map((classroom) => (
                    <MenuItem key={classroom.classroomId} value={classroom.classroomId}>
                      {classroom.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.classroomId && <FormHelperText>{errors.classroomId.message}</FormHelperText>}
          </FormControl>

          {/* Student */}
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
                  disabled={!watchedClassroomId || busy}
                  onChange={(e) => {
                    field.onChange(e);
                    const student = students.find((s) => s.studentId === e.target.value);
                    // Always sync guardian to the newly chosen student (clears a stale one)
                    setValue('guardianId', student?.guardianId ?? '', {
                      shouldValidate: !!student?.guardianId
                    });
                  }}
                >
                  {filteredStudents.map((student) => (
                    <MenuItem key={student.studentId} value={student.studentId}>
                      {student.firstname} {student.lastname}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.studentId ? (
              <FormHelperText>{errors.studentId.message}</FormHelperText>
            ) : (
              !watchedClassroomId && <FormHelperText>Select a classroom first</FormHelperText>
            )}
          </FormControl>

          {/* Guardian */}
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
                  disabled={busy}
                >
                  {guardianOptions.map((guardian) => (
                    <MenuItem key={guardian.guardianId} value={guardian.guardianId}>
                      {guardian.firstname} {guardian.lastname} ({guardian.phone})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.guardianId && <FormHelperText>{errors.guardianId.message}</FormHelperText>}
          </FormControl>

          {/* Amount: pre-filled from the classroom fee, but editable for part payments */}
          <Controller
            name="amount"
            control={control}
            rules={{
              validate: (value) => {
                const amount = Number(value);
                if (value === '' || !Number.isFinite(amount) || amount <= 0) {
                  return 'Amount must be greater than 0';
                }
                if (classroomAmount !== null && amount > classroomAmount) {
                  return `Amount cannot exceed the fee of ${formatNaira(classroomAmount)}`;
                }
                return true;
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount"
                type="number"
                fullWidth
                disabled={busy || feeLoading}
                error={!!errors.amount}
                helperText={
                  errors.amount?.message ??
                  (classroomAmount !== null
                    ? `Full fee: ${formatNaira(classroomAmount)}. You can enter a lower amount for a part payment.`
                    : undefined)
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  field.onChange(raw === '' ? '' : Number(raw));
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                  endAdornment:
                    classroomAmount !== null && field.value !== classroomAmount ? (
                      <Button
                        size="small"
                        onClick={() =>
                          setValue('amount', classroomAmount, { shouldValidate: true })
                        }
                        sx={{ color: 'orange', whiteSpace: 'nowrap' }}
                      >
                        Use full fee
                      </Button>
                    ) : undefined
                }}
                inputProps={{ min: 0 }}
              />
            )}
          />

          {feeError && (
            <Alert severity="warning" sx={{ gridColumn: '1 / -1' }}>
              {feeError}
            </Alert>
          )}

          {/* Selected student summary */}
          {selectedStudent && (
            <Card variant="outlined" sx={{ gridColumn: '1 / -1' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Student Information
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.firstname} {selectedStudent.lastname}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Guardian
                    </Typography>
                    <Typography variant="body1">{selectedStudent.guardianName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Guardian Phone
                    </Typography>
                    <Typography variant="body1">{selectedStudent.guardianPhone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Classroom
                    </Typography>
                    <Typography variant="body1">{selectedStudent.classroomName}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}
          >
            <Button
              style={{ border: '1px solid orange', color: 'orange' }}
              type="button"
              variant="outlined"
              onClick={handleClear}
              disabled={busy}
            >
              Clear
            </Button>
            <Button
              style={{ backgroundColor: 'orange' }}
              type="submit"
              variant="contained"
              disabled={busy || feeLoading}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Record Payment'}
            </Button>
          </Box>
        </Box>
      </form>

      {/* Loading overlay (Paper is position: relative, so this now covers the form) */}
      {(isLoading || feeLoading) && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.6)',
            zIndex: 10
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};

export default ManualFeeRecordForm;
