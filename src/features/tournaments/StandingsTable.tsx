import { useMemo } from 'react';
import type { Team, Match } from '../../types';
import { calculateStandings } from '../../lib/tournament-utils';
import { isStrictTie } from './utils/standings-helpers';
import { StandingsTableHeader } from './components/StandingsTableHeader';
import { StandingsRow } from './components/StandingsRow';

interface StandingsTableProps {
  participants: Team[];
  matches: Match[];
}

export default function StandingsTable({
  participants,
  matches,
}: StandingsTableProps) {
  const standings = useMemo(
    () => calculateStandings(participants, matches),
    [participants, matches],
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <StandingsTableHeader />
        <tbody>
          {standings.map((team, index) => {
            const prevTeam = standings[index - 1];
            const nextTeam = standings[index + 1];
            const isTied =
              isStrictTie(team, prevTeam) || isStrictTie(team, nextTeam);

            return (
              <StandingsRow
                key={team.id}
                team={team}
                rank={index + 1}
                isTied={isTied}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
