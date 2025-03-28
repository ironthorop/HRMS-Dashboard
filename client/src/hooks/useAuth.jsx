import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();

  // Enhanced login function that redirects after successful login
  const login = async (email, password) => {
    try {
      await auth.login(email, password); // Pass email and password correctly
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Enhanced logout function that redirects after logout
  const logout = () => {
    auth.logout();
    navigate('/login', { replace: true });
  };

  return { ...auth, login, logout };
};