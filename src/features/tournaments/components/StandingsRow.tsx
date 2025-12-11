import type { Team } from '../../../types';

interface StandingsRowProps {
  team: Team;
  rank: number;
  isTied: boolean;
}

export const StandingsRow = ({ team, rank, isTied }: StandingsRowProps) => {
  const { stats } = team;
  const goalDiff = stats?.goalDifference || 0;
  const isTopThree = rank <= 3;

  return (
    <tr
      className={`transition-colors ${
        isTied
          ? 'bg-amber-900/20 hover:bg-amber-900/30'
          : 'hover:bg-slate-800/50'
      }`}
    >
      <td className="px-3 py-2 text-center text-slate-500 relative">
        {rank}
        {isTied && (
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"
            title="Empate Total: Requiere desempate manual"
          />
        )}
      </td>
      <td className="px-3 py-2 font-medium flex items-center gap-2">
        {team.name}
        {isTopThree && <span className="text-[10px] text-amber-500">🏆</span>}
      </td>
      <td className="px-3 py-2 text-center">{stats?.matchesPlayed || 0}</td>
      <td className="px-3 py-2 text-center text-slate-300">
        {stats?.wins || 0}
      </td>
      <td className="px-3 py-2 text-center text-slate-300">
        {stats?.draws || 0}
      </td>
      <td className="px-3 py-2 text-center text-slate-300">
        {stats?.losses || 0}
      </td>
      <td className="px-3 py-2 text-center text-slate-400">
        {stats?.goalsScored || 0}
      </td>
      <td className="px-3 py-2 text-center text-slate-400">
        {stats?.goalsAgainst || 0}
      </td>
      <td className="px-3 py-2 text-center font-medium">
        {goalDiff > 0 ? '+' : ''}
        {goalDiff}
      </td>
      <td className="px-3 py-2 text-center font-bold text-indigo-400 bg-slate-800/30">
        {stats?.points || 0}
      </td>
    </tr>
  );
};
