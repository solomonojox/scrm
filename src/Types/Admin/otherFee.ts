export interface ApiResponse<T> {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: T;
}

export interface OtherFee {
  otherFeeId: string;
  schoolId: string;
  classroomId: string;
  feeName: string;
  amount: number;
  isMandatory: boolean;
  description: string;
  sessionId: string;
  termId: string;
  isActive: boolean;
  createdAt: string;
}

export interface OtherFeePayment {
  otherFeePaymentId: string;
  otherFeeId: string;
  feeName: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference: string;
  recordedBy: string;
}

export interface RecordPaymentPayload {
  otherFeeId: string;
  studentId: string;
  schoolId: string;
  guardianId: string;
  amount: number;
  transactionReference: string;
}

export interface GuardianOption {
  guardianId: string;
  name: string;
  phone: string;
}

export interface StudentOption {
  studentId: string;
  name: string;
}