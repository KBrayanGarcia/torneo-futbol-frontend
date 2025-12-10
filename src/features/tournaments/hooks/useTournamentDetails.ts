import { useState } from 'react';
import { useTournament, useTournaments } from '../../../hooks/useTournaments';
import type { Match } from '../../../types';

interface UseTournamentDetailsProps {
  tournamentId: string;
}

export function useTournamentDetails({
  tournamentId,
}: UseTournamentDetailsProps) {
  const { generateFixture } = useTournaments();
  const { data: tournament, isLoading, error } = useTournament(tournamentId);

  // Local state for UI interactions
  const [isEditingFixture, setIsEditingFixture] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const tournamentMatches = tournament?.matches || [];

  const handleGenerateValues = () => {
    if (
      confirm(
        '¿Generar fixture automáticamente? Esto borrará partidos existentes.',
      )
    ) {
      generateFixture.mutate(tournamentId, {
        onSuccess: () => {
          // Toast notification could be added here
        },
      });
    }
  };

  const handleSaveManualFixture = () => alert('En construcción');

  return {
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
  };
}
