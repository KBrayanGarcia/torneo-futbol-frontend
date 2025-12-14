import type { Player } from '../../../types';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export function PlayerList({ players, onEdit, onDelete }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No se encontraron jugadores.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
