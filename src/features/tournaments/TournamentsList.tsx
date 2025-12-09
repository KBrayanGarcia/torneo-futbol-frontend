import { useTournaments } from '../../hooks/useTournaments';
import { TournamentHeader } from './components/TournamentHeader';
import { TournamentEmptyState } from './components/TournamentEmptyState';
import { TournamentCard } from './components/TournamentCard';

export default function TournamentsList() {
  const { tournaments = [], isLoading, error } = useTournaments();

  if (isLoading)
    return <div className="text-center py-20">Cargando torneos...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-400">
        Error al cargar torneos
      </div>
    );

  return (
    <div className="space-y-6">
      <TournamentHeader />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.length === 0 && <TournamentEmptyState />}

        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
