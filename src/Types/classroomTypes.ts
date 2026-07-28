export interface classrooms {
  id: string;
  classroomId: string;
  schoolId: string;
  studentNo?: string;
  name: string;
  capacity: number;
  teacherId: string;
  teacher: string | null;
  schoolFee: string;
  firstname?: string;
  gender?: string;
  lastname?: string;
  students?: [];
  subjects?: [];
  assignment?: [];
  currentSession?: string
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
