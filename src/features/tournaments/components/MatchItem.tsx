import { format, parseISO } from 'date-fns';
import type { Match, Team } from '../../../types';

interface MatchItemProps {
  match: Match;
  teams: Team[];
  onClick?: (match: Match) => void;
}

export const MatchItem = ({ match, teams, onClick }: MatchItemProps) => {
  const getTeamName = (side: 'home' | 'away') => {
    if (side === 'home') {
      if (match.homeTeam) return match.homeTeam.name;
      return teams.find((t) => t.id === match.homeTeamId)?.name || 'Anónimo';
    } else {
      if (match.awayTeam) return match.awayTeam.name;
      return teams.find((t) => t.id === match.awayTeamId)?.name || 'Anónimo';
    }
  };

  return (
    <div
      onClick={() => onClick?.(match)}
      className={`flex items-center justify-between p-3 bg-slate-800/50 rounded transition-colors border border-slate-700/50 ${
        onClick ? 'hover:bg-slate-800 cursor-pointer' : ''
      }`}
    >
      <div className="flex-1 text-right font-medium text-slate-200">
        {getTeamName('home')}
      </div>

      <div className="mx-4 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-medium text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">
            {match.date ? format(parseISO(match.date), 'HH:mm') : '--:--'}
          </span>
        </div>

        <div className="px-3 py-1 bg-slate-950 rounded font-mono text-sm text-slate-300 min-w-[3rem] text-center border border-slate-800 shadow-inner">
          {match.score ? `${match.score.home} - ${match.score.away}` : 'vs'}
        </div>

        {match.round && (
          <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">
            Ronda {match.round}
          </span>
        )}
      </div>

      <div className="flex-1 font-medium text-slate-200">
        {getTeamName('away')}
      </div>
    </div>
  );
};
