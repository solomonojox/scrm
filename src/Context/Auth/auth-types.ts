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
    cbtUser: UserData | null;
    cbtLogin: (token: string) => void;
    login: (token: string) => void;
    logout: () => void;
}