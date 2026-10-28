import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="page-box">
      <h1>Settings</h1>
      <p>Welcome, {currentUser?.name || 'User'}.</p>
      <p>Email: {currentUser?.email || 'N/A'}</p>
    </div>
  );
}
