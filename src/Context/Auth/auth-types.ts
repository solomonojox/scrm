export interface UserData {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    login: (token: string) => void;
    logout: () => void;
}