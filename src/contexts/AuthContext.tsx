import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface User {
    name?: string;
    email: string;
    sub: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userRole: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLoading: boolean; 
}

interface JwtPayload {
  role: string;
  email: string;
  sub: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  const updateUserRole = async (token: string | null) => {
    if (token) {
      try {
        const module = await import('jwt-decode')// jwt_decode<JwtPayload>(token);
        const decoded = module.jwtDecode<JwtPayload>(token);
        /*const module = await import('jwt-decode'); 
        const decoded = module.default(token); */
        setUserRole(decoded.role);
        setUser({
            name: decoded.name,
            email: decoded.email,
            sub: decoded.sub
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
        setUser(null);
      }
    } else {
      setUserRole(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (token) {
            // Set both JWT token and language in axios defaults
            await updateUserRole(token);
            setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const isAdmin = () => userRole === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated, 
        token, 
        userRole, 
        user, 
        login, 
        logout, 
        isAdmin,
        isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
