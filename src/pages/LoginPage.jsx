import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogin() {
    const user = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@twitter.app',
    };

    login(user);
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p>Sign in to access your private settings.</p>
        <button onClick={handleLogin}>Login as Demo User</button>
      </div>
    </div>
  );
}
