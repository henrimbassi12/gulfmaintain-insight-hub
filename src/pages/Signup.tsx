
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page Welcome avec le mode signup
    navigate('/?mode=signup', { replace: true });
  }, [navigate]);

  return null;
};

export default Signup;
