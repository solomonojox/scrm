import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./auth-context";
import { UserData, AuthContextType, CbtUserData } from "./auth-types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [cbtUser, setCbtUser] = useState<CbtUserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("scrmToken");
    const cbtToken = localStorage.getItem("cbtToken");

    if (token) {
      try {
        const decoded = jwtDecode<Partial<any>>(token);
        // console.log("Decoded JWT on mount:", decoded);

        //For NORMAL LOGIN (Microsoft claims)
        const userData = {
          id:
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            decoded?.userId ||
            "",
          email:
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
            decoded?.email ||
            "",
          role:
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded?.role ||
            "",
          schoolReg: decoded.schoolReg || "",
          schoolName: decoded.schoolName || "",
          schoolId: decoded.schoolId || "",
          currentTerm: decoded.term || "",
          termId: decoded.termId || "",
          // sessionId: decoded.sessionId || "",
        };

        // restore both user types
        setUser(userData);

        setIsAuthenticated(true);
      } catch (error) {
        // console.error("Error decoding token:", error);
        localStorage.removeItem("scrmToken");
        localStorage.removeItem("schoolId");
      }
    }

    if (cbtToken) {
      try {
        const decoded = jwtDecode<Partial<any>>(cbtToken);
        const cbtUserData = {
          email: decoded.email || "",
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "",
          schoolReg: decoded.schoolReg || "",
          schoolName: decoded.schoolName || "",
          schoolId: decoded.schoolId || "",
        };
        setCbtUser(cbtUserData);
      } catch (error) {
        // console.error("Error decoding CBT token:", error);
        localStorage.removeItem("cbtToken");
      }
    }
  }, []);

  // Define the login, cbtLogin, and logout functions

  //NORMAL LOGIN
  const login = (token: string, refreshToken?: string) => {
    localStorage.setItem("scrmToken", token);

    if (refreshToken) {
      localStorage.setItem("scrmRefreshToken", refreshToken);
    }

    const decoded = jwtDecode<Partial<any>>(token);
    localStorage.setItem("schoolId", decoded.schoolId);

    setUser({
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "",
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "",
      schoolReg: decoded.schoolReg || "",
      schoolName: decoded.schoolName || "",
      schoolId: decoded.schoolId || "",
      currentTerm: decoded.term || "",
      termId: decoded.termId || "",
      // sessionId: decoded.sessionId || "",
    });

    setIsAuthenticated(true);
  };

  //CBT LOGIN (uses plain field names, because your CBT token does not use Microsoft claims)
  const cbtLogin = (token: string) => {
    localStorage.setItem("cbtToken", token);
    
    const decoded = jwtDecode<Partial<any>>(token);
    localStorage.setItem("schoolId", decoded.schoolId);

    setCbtUser({
      // id: decoded.userId || "",
      email: decoded.email || "",
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "",
      schoolReg: decoded.schoolReg || "",
      schoolName: decoded.schoolName || "",
      schoolId: decoded.schoolId || "",
    });

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("scrmToken");
    localStorage.removeItem("schoolId");
    setUser(null);
    setCbtUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    cbtUser,
    login,
    cbtLogin,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
