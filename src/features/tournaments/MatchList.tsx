import { es } from 'date-fns/locale';
import type { Match, Team } from '../../types';
import { MatchItem } from './components/MatchItem';
import {
  getGroupDateLabel,
  groupMatchesByDate,
  sortMatchesByTime,
} from './utils/match-grouping';

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  onMatchClick?: (match: Match) => void;
}

export default function MatchList({
  matches,
  teams,
  onMatchClick,
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded">
        No hay partidos generados aún.
      </div>
    );
  }

  const matchesByDate = groupMatchesByDate(matches);

  return (
    <div className="space-y-6">
      {Object.entries(matchesByDate)
        .sort()
        .map(([date, dateMatches]) => (
          <div key={date} className="space-y-2">
            <h4 className="text-sm font-medium text-indigo-400 border-b border-indigo-500/20 pb-1">
              {getGroupDateLabel(date, es)}
            </h4>
            <div className="space-y-2">
              {sortMatchesByTime(dateMatches).map((match) => (
                <MatchItem
                  key={match.id}
                  match={match}
                  teams={teams}
                  onClick={onMatchClick}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
