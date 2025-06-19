
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

type UserRole = 'student' | 'teacher' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  instituteId?: string;
  class?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: Partial<User>, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Mock data for demo purposes
  const mockStudents = [
    { id: '1', name: 'Student 1', email: 'student1@example.com', password: 'password', role: 'student', instituteId: 'INST001', class: '6' },
    { id: '2', name: 'Student 2', email: 'student2@example.com', password: 'password', role: 'student', instituteId: 'INST001', class: '7' },
    { id: '3', name: 'Student 3', email: 'student3@example.com', password: 'password', role: 'student', instituteId: 'INST002', class: '8' },
  ];
  
  const mockTeachers = [
    { id: '1', name: 'Teacher 1', email: 'teacher1@example.com', password: 'password', role: 'teacher', instituteId: 'INST001' },
    { id: '2', name: 'Teacher 2', email: 'teacher2@example.com', password: 'password', role: 'teacher', instituteId: 'INST002' },
  ];
  
  useEffect(() => {
    // Check for stored user in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('nmmsUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      let foundUser = null;
      
      // Find user based on role
      if (role === 'student') {
        foundUser = mockStudents.find(
          student => student.email === email && student.password === password
        );
      } else if (role === 'teacher') {
        foundUser = mockTeachers.find(
          teacher => teacher.email === email && teacher.password === password
        );
      }
      
      if (foundUser) {
        // Remove password before storing
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('nmmsUser', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check if user already exists
      const userExists = role === 'student' 
        ? mockStudents.some(student => student.email === userData.email)
        : mockTeachers.some(teacher => teacher.email === userData.email);
      
      if (userExists) {
        toast({
          title: "Registration Failed",
          description: "User with this email already exists",
          variant: "destructive",
        });
        return;
      }
      
      // Create new user (in a real app, this would be sent to the backend)
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role,
      };
      
      // Store user (without password) in localStorage for demo
      setUser(newUser as User);
      localStorage.setItem('nmmsUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${userData.name}!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nmmsUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
