export interface classrooms {
  id: string;
  classroomId: string;
  schoolId: string;
  studentNo?: string;
  name: string;
  capacity: number;
  teacherId: string;
  teacher?: Teacher | null | undefined;
  schoolFee: string;
  firstname?: string;
  gender?: string;
  lastname?: string;
  students?: [];
  subjects?: [];
  assignment?: [];
  currentSession?: string;
}

export interface StudentRecord {
  studentId: string;
  studentNo: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string; // ISO 8601 date string
  gender: string | null;
  homeAddress: string;
  imagePath: string | null;
  passwordHash: string;

  // Academic / Session Info
  admissionSession: string;
  currentSession: string;
  currentTerm: string | null;
  currentTermId: string | null;

  // Foreign Keys (UUIDs)
  classroomId: string;
  guardianId: string;
  schoolId: string;
  teacherId: string;

  // Navigation / Relation Properties
  classroom?: any | null;
  guardian?: any | null;
  school?: any | null;
  teacher?: any | null;
  subjects?: any[] | null;
  attendances: any[];
  assignmentSubmissions?: any[] | null;
  result?: any | null;
}

interface Teacher {
  teacherId: string;
  schoolId: string;
  firstname: string;
  lastname: string;
  phone: string;
  homeAddress: string;
  nationality: string;
  stateOfOrigin: string;
  religion: string;
  email: string;
  username: string;
  dateOfBirth: string;
  employmentDate: string;
  passwordHash: string;
  imagePath: string | null;
  role: string;
  resetStatus: number;
  assignments: unknown[];
  subjects: unknown[];
  classroom: unknown | null;
  salary: unknown | null;
  payrollRecords: unknown | null;
  earnings: unknown | null;
  deductions: unknown | null;
  personalQRCode: unknown | null;
  lastAttendanceDate: string | null;
  defaultDeviceId: string | null;
  yearToDateAttendance: unknown | null;
  statsLastUpdated: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  isActive: boolean;
  deactivatedAt: string | null;
  subjectTeachers: unknown | null;
}
