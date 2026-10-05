import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return { logout: handleLogout, isLoggingOut };
};
