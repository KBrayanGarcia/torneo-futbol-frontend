import { useState, useMemo } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { useStore } from '../../../store/useStore';
import type { Team, Match, Tournament } from '../../../types';

interface UseFixtureEditorProps {
  tournament: Tournament;
  onSave: (matches: Match[]) => void;
}

interface FixtureMatch {
  id: string;
  home: string | null;
  away: string | null;
}

export function useFixtureEditor({
  tournament,
  onSave,
}: UseFixtureEditorProps) {
  const { teams } = useStore();

  // 1. Filtrar equipos que participan en este torneo
  const tournamentTeams = useMemo(
    () =>
      teams.filter((t) => tournament.participants.some((p) => p.id === t.id)),
    [teams, tournament.participants],
  );

  // 2. Estado de los partidos manuales (empezamos con uno vacio)
  const [matches, setMatches] = useState<FixtureMatch[]>([
    { id: crypto.randomUUID(), home: null, away: null },
  ]);

  const [activeDragItem, setActiveDragItem] = useState<Team | null>(null);

  // 3. Calcular equipos ya asignados y disponibles (Derived State)
  const assignedTeamIds = useMemo(
    () => matches.flatMap((m) => [m.home, m.away]).filter(Boolean) as string[],
    [matches],
  );

  const availableTeams = useMemo(
    () => tournamentTeams.filter((t) => !assignedTeamIds.includes(t.id)),
    [tournamentTeams, assignedTeamIds],
  );

  // 4. Manejar el evento de soltar (Drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const teamId = active.id as string;
    // El ID del slot tiene formato "matchId:position" (ej: "uuid:home")
    const [matchId, position] = (over.id as string).split(':');

    if (matchId && (position === 'home' || position === 'away')) {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id === matchId) {
            // Actualizamos solo el lado correspondiente (home o away)
            return { ...m, [position]: teamId };
          }
          return m;
        }),
      );
    }
  };

  // Eliminar un equipo específico de un partido (dejar el slot vacío)
  const removeTeamFromMatch = (matchId: string, position: 'home' | 'away') => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) return { ...m, [position]: null };
        return m;
      }),
    );
  };

  // Agregar una nueva fila de partido vacía al final
  const addNewMatch = () => {
    setMatches((prev) => [
      ...prev,
      { id: crypto.randomUUID(), home: null, away: null },
    ]);
  };

  // Eliminar un partido completo de la lista
  const removeMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  // Validar y guardar los partidos terminados
  const handleSave = () => {
    const validMatches = matches
      // Solo guardamos partidos que tengan ambos equipos asignados
      .filter((m) => m.home && m.away)
      .map(
        (m) =>
          ({
            id: m.id,
            tournamentId: tournament.id,
            homeTeamId: m.home!,
            awayTeamId: m.away!,
            date: new Date().toISOString(),
            status: 'SCHEDULED',
            round: 1,
          } as Match),
      );

    onSave(validMatches);
  };

  return {
    matches,
    availableTeams,
    tournamentTeams,
    activeDragItem,
    setActiveDragItem,
    handleDragEnd,
    addNewMatch,
    removeMatch,
    removeTeamFromMatch,
    handleSave,
  };
}
