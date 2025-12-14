import type { Player } from '../../../types';
import type { PlayerFormData } from '../components/PlayerForm';

interface UsePlayerMutationsProps {
  createPlayer: (data: Partial<Player>) => void;
  updatePlayer: (variables: { id: string; data: Partial<Player> }) => void;
  onSuccess?: () => void;
}

export function usePlayerMutations({
  createPlayer,
  updatePlayer,
  onSuccess,
}: UsePlayerMutationsProps) {
  const handleSubmit = (data: PlayerFormData, editingId?: string | null) => {
    if (editingId) {
      updatePlayer({
        id: editingId,
        data: { name: data.name, avatar: data.avatar },
      });
    } else {
      createPlayer({
        name: data.name,
        avatar: data.avatar,
        stats: {
          matchesPlayed: 0,
          wins: 0,
          goalsScored: 0,
        },
      });
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    handleSubmit,
  };
}
