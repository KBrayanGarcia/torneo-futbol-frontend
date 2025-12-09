import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import PlayerManager from './features/admin/PlayerManager';
import TeamManager from './features/admin/TeamManager';
import TournamentsList from './features/tournaments/TournamentsList';
import TournamentCreator from './features/tournaments/TournamentCreator';
import TournamentDetails from './features/tournaments/TournamentDetails';
import Home from './features/home/Home';
import PublicTournamentsList from './features/public/PublicTournamentsList';
import PublicTournamentDetails from './features/public/PublicTournamentDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Admin Routes */}
          <Route path="tournaments" element={<TournamentsList />} />
          <Route path="tournaments/new" element={<TournamentCreator />} />
          <Route path="tournaments/:id" element={<TournamentDetails />} />
          <Route path="players" element={<PlayerManager />} />
          <Route path="teams" element={<TeamManager />} />

          {/* Public Routes */}
          <Route path="public" element={<PublicTournamentsList />} />
          <Route
            path="public/tournaments/:id"
            element={<PublicTournamentDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
