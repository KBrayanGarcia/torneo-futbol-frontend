import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Trophy, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Tournament } from '../../../types';
import { STATUS_COLORS, STATUS_LABELS } from './constants';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group hover:border-indigo-500/50 transition-all cursor-pointer bg-slate-900 border-slate-800"
      onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`
            px-2 py-1 rounded text-xs font-bold text-white
            ${STATUS_COLORS[tournament.status]}
          `}
          >
            {STATUS_LABELS[tournament.status]}
          </div>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>

        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">
          {tournament.name}
        </h3>

        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {tournament.startDate
                ? format(new Date(tournament.startDate), 'd MMM yyyy', {
                    locale: es,
                  })
                : 'Sin fecha inicio'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {tournament.config.type === 'CUP' ? 'Copa' : 'Liga'} •{' '}
              {tournament.config.format}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
