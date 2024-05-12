// useRequireAuth.js
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useRequireAuth = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!isLoggedIn) {
      // Redirect to the login page if the user is not logged in
      navigate('/login');
      console.log("NOT LOGGED IN!")
    }
    else {
      // You can use the token here if needed
      navigate('/subscribe')
      console.log("YOU ARE LOGGED IN. Token:", token);
    }
  };

  return { requireAuth, isLoggedIn, token };
};
