import { useState } from 'react';
import { useTournaments } from '../../../hooks/useTournaments';
import type { Tournament } from '../../../types';

export interface TournamentEditorState {
  name: string;
  startDate: string;
  endDate: string;
  excludeWeekends: boolean;
  dailyMode: boolean;
}

export function useTournamentEditor(
  tournament: Tournament,
  onClose: () => void,
) {
  const { updateTournament } = useTournaments();

  const [formData, setFormData] = useState<TournamentEditorState>({
    name: tournament.name,
    startDate: tournament.config.startDate || '',
    endDate: tournament.config.endDate || '',
    excludeWeekends: tournament.config.excludedDays?.includes(0) || false,
    dailyMode: tournament.config.schedulingMode === 'DAILY_FOR_ALL',
  });

  const setField = <K extends keyof TournamentEditorState>(
    field: K,
    value: TournamentEditorState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    updateTournament.mutate({
      id: tournament.id,
      data: {
        name: formData.name,
        config: {
          ...tournament.config,
          startDate: formData.startDate,
          endDate: formData.endDate,
          excludedDays: formData.excludeWeekends ? [0, 6] : [],
          schedulingMode: formData.dailyMode ? 'DAILY_FOR_ALL' : 'DISTRIBUTED',
        },
      },
    });
    onClose();
  };

  return {
    formData,
    setField,
    saveChanges,
  };
}
