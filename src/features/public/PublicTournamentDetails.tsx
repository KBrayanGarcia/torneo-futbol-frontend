import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournaments';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, Users, Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import StandingsTable from '../tournaments/StandingsTable';
import MatchList from '../tournaments/MatchList';
import { parseLocalDate } from '../../lib/tournament-utils';

export default function PublicTournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tournament, isLoading } = useTournament(id || '');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-slate-500">Cargando torneo...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl text-slate-400">Torneo no encontrado</h2>
        <Button onClick={() => navigate('/public')}>Volver al listado</Button>
      </div>
    );
  }

  const tournamentMatches = tournament.matches || [];

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/public')}
        className="gap-2 pl-0 hover:pl-2 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Torneos
      </Button>

      <div className="from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-4">
              {tournament.name}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">
                  {tournament.config.type === 'CUP' ? 'Copa' : 'Liga'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <Users className="h-4 w-4" />
                <span>
                  {tournament.config.format} ({tournament.participants.length}{' '}
                  equipos)
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Iniciado:{' '}
                  {tournament.config.startDate
                    ? format(
                        parseLocalDate(tournament.config.startDate),
                        'd MMM yyyy',
                        { locale: es },
                      )
                    : format(new Date(tournament.createdAt), 'd MMM yyyy', {
                        locale: es,
                      })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-indigo-500 w-1 h-6 rounded-full inline-block"></span>
            Partidos y Resultados
          </h2>
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800">
            <MatchList
              matches={tournamentMatches}
              teams={tournament.participants}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-amber-500 w-1 h-6 rounded-full inline-block"></span>
            Tabla de Posiciones
          </h2>
          <Card className="border-slate-800 bg-slate-900/80 sticky top-4">
            <CardContent className="p-0">
              <StandingsTable
                participants={tournament.participants}
                matches={tournamentMatches}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
