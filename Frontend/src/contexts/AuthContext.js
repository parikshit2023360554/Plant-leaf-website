import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Mock user data
  const mockUsers = [
    {
      id: '1',
      email: 'demo@plantcare.com',
      password: 'demo123',
      name: 'Demo User',
      avatar: '🌱',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      avatar: '🧑‍🌾',
      joinDate: '2024-02-20'
    }
  ];

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('plantcare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('plantcare_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Load analysis history when user changes
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`plantcare_history_${user.id}`);
      if (savedHistory) {
        try {
          setAnalysisHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Error parsing analysis history:', error);
          setAnalysisHistory([]);
        }
      } else {
        setAnalysisHistory([]);
      }
    } else {
      setAnalysisHistory([]);
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
        joinDate: foundUser.joinDate
      };
      
      setUser(userData);
      localStorage.setItem('plantcare_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, user: userData };
    } else {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'User with this email already exists' 
      };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      avatar: '👤',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setUser(newUser);
    localStorage.setItem('plantcare_user', JSON.stringify(newUser));
    setIsLoading(false);
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plantcare_user');
  };

  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, error: 'No user logged in' };
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('plantcare_user', JSON.stringify(updatedUser));
    setIsLoading(false);
    
    return { success: true, user: updatedUser };
  };

  const addAnalysisToHistory = (analysisResult, imageDataUrl) => {
    if (!user) return;

    const historyEntry = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      image: imageDataUrl,
      result: analysisResult,
      userId: user.id
    };

    const updatedHistory = [historyEntry, ...analysisHistory];
    setAnalysisHistory(updatedHistory);
    localStorage.setItem(`plantcare_history_${user.id}`, JSON.stringify(updatedHistory));
  };

  const deleteAnalysisFromHistory = (analysisId) => {
    if (!user) return;

    const updatedHistory = analysisHistory.filter(entry => entry.id !== analysisId);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem(`plantcare_history_${user.id}`, JSON.stringify(updatedHistory));
  };

  const clearAnalysisHistory = () => {
    if (!user) return;

    setAnalysisHistory([]);
    localStorage.removeItem(`plantcare_history_${user.id}`);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    analysisHistory,
    addAnalysisToHistory,
    deleteAnalysisFromHistory,
    clearAnalysisHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
