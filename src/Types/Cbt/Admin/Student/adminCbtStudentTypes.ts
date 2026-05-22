export interface AdminCbtStudentType {
  studentId: string;
  studentNo?: string;
  schoolId: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  homeAddress: string;
  admissionSession?: string | null;
  currentTerm?: string | null;
  gender?: string | null;
  imagePath?: string | null;
}
