import React, { useEffect, useState, createContext, useContext } from 'react';
type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Mock user data
  const mockUsers = [{
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    isAdmin: true
  }, {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    isAdmin: false
  }];
  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('mockStockUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const {
        password,
        ...userWithoutPassword
      } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('mockStockUser', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    setLoading(false);
  };
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    // Create new user (in a real app, this would be stored in a database)
    const newUser = {
      id: `${mockUsers.length + 1}`,
      email,
      name,
      isAdmin: false
    };
    setCurrentUser(newUser);
    localStorage.setItem('mockStockUser', JSON.stringify(newUser));
    setLoading(false);
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockStockUser');
  };
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};