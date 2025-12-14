import type { Team } from '../../../types';
import { TeamCard } from './TeamCard';

interface TeamListProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
}

export function TeamList({ teams, onEdit, onDelete }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No se encontraron equipos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
