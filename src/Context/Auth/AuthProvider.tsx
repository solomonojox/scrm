import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';
import { UserData, AuthContextType } from './auth-types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  // console.log(user)

  useEffect(() => {
    const token = localStorage.getItem('scrmToken');
    // console.log(token)
    if (token) {
      try {
        const decoded = jwtDecode<Partial<any>>(token);
        setUser({
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '',
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '',
          schoolReg: decoded.schoolReg || '',
          schoolName: decoded.schoolName || '',
          schoolId: decoded.schoolId || '',
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('scrmToken');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('scrmToken', token);
    const decoded = jwtDecode<Partial<any>>(token);
    setUser({
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '',
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '',
      schoolReg: decoded.schoolReg || '',
      schoolName: decoded.schoolName || '',
      schoolId: decoded.schoolId || '',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('scrmToken');
    // sessionStorage.removeItem('navPath')
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}