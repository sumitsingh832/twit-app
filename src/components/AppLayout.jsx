import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Mini Twitter</h2>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/profile/demo-user">Profile</Link>
          {isAuthenticated ? <Link to="/settings">Settings</Link> : <Link to="/login">Login</Link>}
        </nav>

        {isAuthenticated ? (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        )}
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
