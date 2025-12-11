import { useState, useEffect } from 'react';
import { useTournaments } from '../../../hooks/useTournaments';
import type { Match } from '../../../types';

interface UseMatchResultProps {
  match: Match | null;
  onClose: () => void;
}

export function useMatchResult({ match, onClose }: UseMatchResultProps) {
  const { updateMatch } = useTournaments();

  // Estado local para los marcadores
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  // Sincronizar estado cuando cambia el partido seleccionado
  useEffect(() => {
    if (match) {
      setHomeScore(match.score?.home?.toString() || '');
      setAwayScore(match.score?.away?.toString() || '');
    }
    // Usamos propiedades primitivas para evitar loops infinitos si 'match' cambia de referencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id, match?.score?.home, match?.score?.away]);

  const handleSave = () => {
    if (!match) return;

    const hScore = parseInt(homeScore);
    const aScore = parseInt(awayScore);

    if (isNaN(hScore) || isNaN(aScore)) return;

    updateMatch.mutate({
      id: match.id,
      data: {
        score: { home: hScore, away: aScore },
        status: 'PLAYED',
      },
    });

    onClose();
  };

  const isValid = homeScore !== '' && awayScore !== '';

  return {
    homeScore,
    setHomeScore,
    awayScore,
    setAwayScore,
    handleSave,
    isValid,
  };
}
