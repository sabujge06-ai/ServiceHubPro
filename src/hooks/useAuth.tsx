import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone_number: string; password: string; current_address: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    
    if (token) {
      if (userType === 'admin') {
        // For admin, we'd need to fetch admin profile
        const storedAdmin = localStorage.getItem('admin_data');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
        setIsLoading(false);
      } else {
        api.getUserProfile()
          .then(setUser)
          .catch(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_type');
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_type', 'user');
    if (response.user) {
      setUser(response.user);
    } else {
      const profile = await api.getUserProfile();
      setUser(profile);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    const response = await api.adminLogin(email, password);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_type', 'admin');
    if (response.admin) {
      setAdmin(response.admin);
      localStorage.setItem('admin_data', JSON.stringify(response.admin));
    }
  };

  const register = async (data: { name: string; email: string; phone_number: string; password: string; current_address: string }) => {
    await api.register(data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('admin_data');
    setUser(null);
    setAdmin(null);
  };

  const refreshUser = async () => {
    if (user) {
      const profile = await api.getUserProfile();
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isLoading,
        isAuthenticated: !!(user || admin),
        isAdmin: !!admin,
        login,
        adminLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
