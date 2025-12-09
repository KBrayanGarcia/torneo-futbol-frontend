import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import PlayerManager from './features/admin/PlayerManager';
import TeamManager from './features/admin/TeamManager';
import TournamentsList from './features/tournaments/TournamentsList';
import TournamentCreator from './features/tournaments/TournamentCreator';
import TournamentDetails from './features/tournaments/TournamentDetails';
import PublicTournamentsList from './features/public/PublicTournamentsList';
import PublicTournamentDetails from './features/public/PublicTournamentDetails';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/public" replace />} />

          {/* Login Route (Standalone) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public Routes (Public Layout) */}
          <Route path="/public" element={<PublicLayout />}>
            <Route index element={<PublicTournamentsList />} />
            <Route
              path="tournaments/:id"
              element={<PublicTournamentDetails />}
            />
          </Route>

          {/* Admin Routes (Protected + Admin Layout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="tournaments" element={<TournamentsList />} />
            <Route path="tournaments/new" element={<TournamentCreator />} />
            <Route path="tournaments/:id" element={<TournamentDetails />} />
            <Route path="players" element={<PlayerManager />} />
            <Route path="teams" element={<TeamManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
