import { useMemo } from 'react';
import type { Team, Match } from "../../types";
import { calculateStandings } from "../../lib/tournament-utils";

interface StandingsTableProps {
    participants: Team[];
    matches: Match[];
}

export default function StandingsTable({ participants, matches }: StandingsTableProps) {
    const standings = useMemo(() => calculateStandings(participants, matches), [participants, matches]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-400 font-medium">
                    <tr>
                        <th className="px-3 py-2 rounded-tl-lg">Pos</th>
                        <th className="px-3 py-2 w-full">Equipo</th>
                        <th className="px-3 py-2 text-center">PJ</th>
                        <th className="px-3 py-2 text-center text-emerald-400">G</th>
                        <th className="px-3 py-2 text-center text-amber-400">E</th>
                        <th className="px-3 py-2 text-center text-rose-400">P</th>
                        <th className="px-3 py-2 text-center">GF</th>
                        <th className="px-3 py-2 text-center">GC</th>
                        <th className="px-3 py-2 text-center">DG</th>
                        <th className="px-3 py-2 text-center font-bold text-white rounded-tr-lg">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team, index) => {
                        // Check for absolute tie with previous or next team
                        const prevTeam = standings[index - 1];
                        const nextTeam = standings[index + 1];
                        
                        const isTie = (other: Team | undefined) => {
                            if (!other || !team.stats || !other.stats) return false;
                            return team.stats.points === other.stats.points &&
                                   team.stats.goalDifference === other.stats.goalDifference &&
                                   team.stats.goalsScored === other.stats.goalsScored; 
                                   // Note: H2H is already applied in sort, so if they are still equal here, it's a deep tie
                        };

                        const isTied = isTie(prevTeam) || isTie(nextTeam);

                        return (
                        <tr key={team.id} className={`transition-colors ${isTied ? 'bg-amber-900/20 hover:bg-amber-900/30' : 'hover:bg-slate-800/50'}`}>
                            <td className="px-3 py-2 text-center text-slate-500 relative">
                                {index + 1}
                                {isTied && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" title="Empate Total: Requiere desempate manual" />}
                            </td>
                            <td className="px-3 py-2 font-medium flex items-center gap-2">
                                {team.name}
                                {index < 3 && <span className="text-[10px] text-amber-500">🏆</span>}
                            </td>
                            <td className="px-3 py-2 text-center">{team.stats?.matchesPlayed || 0}</td>
                            <td className="px-3 py-2 text-center text-slate-300">{team.stats?.wins || 0}</td>
                            <td className="px-3 py-2 text-center text-slate-300">{team.stats?.draws || 0}</td>
                            <td className="px-3 py-2 text-center text-slate-300">{team.stats?.losses || 0}</td>
                            <td className="px-3 py-2 text-center text-slate-400">{team.stats?.goalsScored || 0}</td>
                            <td className="px-3 py-2 text-center text-slate-400">{team.stats?.goalsAgainst || 0}</td>
                            <td className="px-3 py-2 text-center font-medium">
                                {team.stats?.goalDifference !== undefined && team.stats.goalDifference > 0 ? '+' : ''}
                                {team.stats?.goalDifference || 0}
                            </td>
                            <td className="px-3 py-2 text-center font-bold text-indigo-400 bg-slate-800/30">
                                {team.stats?.points || 0}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
