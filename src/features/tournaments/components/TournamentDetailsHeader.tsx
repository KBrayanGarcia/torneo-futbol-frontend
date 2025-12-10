import { Trophy, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../../lib/utils';
import { parseLocalDate } from '../../../lib/tournament-utils';
import type { Tournament } from '../../../types';

interface TournamentDetailsHeaderProps {
  tournament: Tournament | undefined;
}

export function TournamentDetailsHeader({
  tournament,
}: TournamentDetailsHeaderProps) {
  if (!tournament) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {tournament.name || 'Torneo sin nombre'}
        </h2>
        <div
          className={cn(
            'px-2 py-0.5 rounded text-xs font-bold text-white',
            tournament.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500',
          )}
        >
          {tournament.status === 'ACTIVE' ? 'En Curso' : 'Borrador'}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span>{tournament.config?.type === 'CUP' ? 'Copa' : 'Liga'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          <span>
            {tournament.config?.format} ({tournament.participants?.length || 0}{' '}
            equipos)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>
            {tournament.config?.startDate
              ? `Inicio: ${format(
                  parseLocalDate(tournament.config.startDate),
                  'd MMM',
                  { locale: es },
                )}`
              : `Creado: ${format(new Date(tournament.createdAt), 'd MMM', {
                  locale: es,
                })}`}
          </span>
        </div>
      </div>
    </div>
  );
}
