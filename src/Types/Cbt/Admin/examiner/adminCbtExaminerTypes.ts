export interface ExaminerType {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  schoolId: string;
  isActive?: boolean;
  createdAt?: string;
}
