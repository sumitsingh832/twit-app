import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route
            path="settings"
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
