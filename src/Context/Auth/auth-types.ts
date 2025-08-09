export interface UserData {
  id: string;
  email: string;
  role: string;
  schoolReg: string;
  schoolName: string;
  schoolId: string
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    login: (token: string) => void;
    logout: () => void;
}