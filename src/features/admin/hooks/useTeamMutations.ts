export interface TeamFormData {
  name: string;
  isFixed: boolean;
  playerIds: string[];
}

// DTO for creating/updating teams (backend expects playerIds, not full player objects)
export interface CreateTeamDTO {
  name: string;
  isFixed: boolean;
  playerIds: string[];
}

interface UseTeamMutationsProps {
  createTeam: (data: CreateTeamDTO) => void;
  updateTeam: (variables: { id: string; data: Partial<CreateTeamDTO> }) => void;
  onSuccess?: () => void;
}

export function useTeamMutations({
  createTeam,
  updateTeam,
  onSuccess,
}: UseTeamMutationsProps) {
  const handleSubmit = (data: TeamFormData, editingId?: string | null) => {
    // Backend expects 'playerIds' but Team type usually expects 'players' object array.
    // We cast to any or a specific DTO to allow sending playerIds.
    const payload = {
      name: data.name,
      isFixed: data.isFixed,
      playerIds: data.playerIds,
    };

    if (editingId) {
      updateTeam({
        id: editingId,
        data: payload,
      });
    } else {
      createTeam(payload);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    handleSubmit,
  };
}
