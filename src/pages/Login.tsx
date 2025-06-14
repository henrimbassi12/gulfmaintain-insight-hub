
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page Welcome avec le mode login
    navigate('/?mode=login', { replace: true });
  }, [navigate]);

  return null;
};

export default Login;
