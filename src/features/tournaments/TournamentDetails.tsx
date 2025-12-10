import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import FixtureEditor from './FixtureEditor';
import TournamentEditorModal from './TournamentEditorModal';
import StandingsTable from './StandingsTable';
import MatchList from './MatchList';
import MatchResultModal from './MatchResultModal';

import { useParams } from 'react-router-dom';

import { useTournamentDetails } from './hooks/useTournamentDetails';
import { TournamentDetailsHeader } from './components/TournamentDetailsHeader';
import { TournamentActions } from './components/TournamentActions';

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    tournament,
    isLoading,
    error,
    tournamentMatches,
    isEditingFixture,
    setIsEditingFixture,
    isConfigOpen,
    setIsConfigOpen,
    selectedMatch,
    setSelectedMatch,
    handleGenerateValues,
    handleSaveManualFixture,
  } = useTournamentDetails({ tournamentId: id! });

  if (isLoading)
    return <div className="text-center py-20">Cargando detalles...</div>;
  if (error || !tournament)
    return (
      <div className="text-center py-20 text-red-500">
        Error al cargar torneo
      </div>
    );

  if (isEditingFixture) {
    return (
      <FixtureEditor
        tournament={tournament}
        onSave={handleSaveManualFixture}
        onCancel={() => setIsEditingFixture(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TournamentDetailsHeader tournament={tournament} />

        <TournamentActions
          matchCount={tournamentMatches.length}
          onConfigOpen={() => setIsConfigOpen(true)}
          onFixtureEdit={() => setIsEditingFixture(true)}
          onGenerate={handleGenerateValues}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partidos</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchList
                matches={tournamentMatches}
                teams={tournament.participants}
                onMatchClick={(m) => setSelectedMatch(m)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Posiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <StandingsTable
                participants={tournament.participants}
                matches={tournamentMatches}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <TournamentEditorModal
        tournament={tournament}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      <MatchResultModal
        key={selectedMatch?.id}
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
