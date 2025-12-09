import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Match, Team } from "../../types";
import { parseLocalDate } from "../../lib/tournament-utils";

interface MatchListProps {
    matches: Match[];
    teams: Team[];
    onMatchClick?: (match: Match) => void; // Optional interaction
}

export default function MatchList({ matches, teams, onMatchClick }: MatchListProps) {
    const getTeamName = (match: Match, side: 'home' | 'away') => {
        if (side === 'home') {
            if (match.homeTeam) return match.homeTeam.name;
            return teams.find(t => t.id === match.homeTeamId)?.name || 'Anónimo';
        } else {
            if (match.awayTeam) return match.awayTeam.name;
            return teams.find(t => t.id === match.awayTeamId)?.name || 'Anónimo';
        }
    };

    if (matches.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded">
                No hay partidos generados aún.
            </div>
        );
    }

    // Group matches by date
    const matchesByDate = matches.reduce((acc, match) => {
        try {
            const dateKey = match.date ? format(parseISO(match.date), "yyyy-MM-dd") : 'Sin Fecha';
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(match);
        } catch (e) {
            console.error('Error grouping match:', match, e);
        }
        return acc;
    }, {} as Record<string, Match[]>);

    console.log('MatchList grouped:', matchesByDate);

    return (
        <div className="space-y-6">
            {Object.entries(matchesByDate).sort().map(([date, dateMatches]) => (
                <div key={date} className="space-y-2">
                    <h4 className="text-sm font-medium text-indigo-400 border-b border-indigo-500/20 pb-1">
                        {date === 'Sin Fecha' ? 'Pendientes' : format(parseLocalDate(date), "EEEE d 'de' MMMM", { locale: es })}
                    </h4>
                    <div className="space-y-2">
                        {dateMatches.sort((a, b) => {
                            // Sort by round then time if possible, or just time
                           const timeA = a.date ? parseISO(a.date).getTime() : 0;
                           const timeB = b.date ? parseISO(b.date).getTime() : 0;
                           return timeA - timeB;
                        }).map((match) => (
                            <div 
                                key={match.id} 
                                onClick={() => onMatchClick?.(match)}
                                className={`flex items-center justify-between p-3 bg-slate-800/50 rounded transition-colors border border-slate-700/50 ${onMatchClick ? 'hover:bg-slate-800 cursor-pointer' : ''}`}
                            >
                                <div className="flex-1 text-right font-medium text-slate-200">{getTeamName(match, 'home')}</div>
                                <div className="mx-4 flex flex-col items-center">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">
                                            {match.date ? format(parseISO(match.date), "HH:mm") : '--:--'}
                                        </span>
                                    </div>
                                    <div className="px-3 py-1 bg-slate-950 rounded font-mono text-sm text-slate-300 min-w-[3rem] text-center border border-slate-800 shadow-inner">
                                        {match.score ? `${match.score.home} - ${match.score.away}` : 'vs'}
                                    </div>
                                    {match.round && <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">Ronda {match.round}</span>}
                                </div>
                                <div className="flex-1 font-medium text-slate-200">{getTeamName(match, 'away')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
