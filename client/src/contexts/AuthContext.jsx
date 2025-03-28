import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { loginUser, verifyToken } from "../services/api";

// Create context
const AuthContext = createContext(undefined);

// Context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('hrms_user');
        const tokenExpiry = localStorage.getItem('hrms_token_expiry');
        
        if (storedUser && tokenExpiry) {
          // Check if token has expired
          if (Number(tokenExpiry) > Date.now()) {
            const token = localStorage.getItem('hrms_token');
            const isValid = await verifyToken(token);
            if (isValid) {
              setUser(JSON.parse(storedUser));
            } else {
              handleLogout();
              toast.error('Your session has expired. Please log in again.');
            }
          } else {
            // Token expired - log user out
            handleLogout();
            toast.error('Your session has expired. Please log in again.');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    
    // Set up expiry check interval
    const interval = setInterval(() => {
      const tokenExpiry = localStorage.getItem('hrms_token_expiry');
      if (tokenExpiry && Number(tokenExpiry) <= Date.now()) {
        handleLogout();
        toast.error('Your session has expired. Please log in again.');
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);

      const { token, user } = await loginUser({ email, password });

      // Set expiry time (2 hours from now)
      const expiryTime = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem("hrms_token", token);
      localStorage.setItem("hrms_token_expiry", expiryTime.toString());
      localStorage.setItem("hrms_user", JSON.stringify(user));

      setUser(user);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error.message || error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_token_expiry');
    localStorage.removeItem('hrms_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
