export interface AdminType {
  schoolAdminId?: string;
  schoolId?: string;
  schoolName?: string | null;
  fullname?: string;
  createdAt?: string;
  email?: string;
  passwordHash?: string;
  role?: string;
  imageUrl?: string | null;
}
