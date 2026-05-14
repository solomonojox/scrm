export interface UserData {
  id: string;
  email: string;
  role: string;
  schoolReg: string;
  schoolName: string;
  schoolId: string;
  currentTerm?: string;
  termId?: string;
  sessionId?: string;
}

export interface CbtUserData {
  id?: string;
  email: string;
  role: string;
  schoolReg: string;
  schoolName: string;
  schoolId: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    cbtUser: CbtUserData | null;
    cbtLogin: (token: string) => void;
    login: (token: string) => void;
    logout: () => void;
}