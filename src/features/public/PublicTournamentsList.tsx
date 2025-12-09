import { useNavigate } from 'react-router-dom';
import { useTournaments } from '../../hooks/useTournaments';
import { Card, CardContent } from '../../components/ui/card';
import { Trophy, Calendar, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TournamentStatus } from '../../types';

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: 'bg-slate-500',
  ACTIVE: 'bg-emerald-500',
  COMPLETED: 'bg-indigo-500',
};

const statusLabels: Record<TournamentStatus, string> = {
  DRAFT: 'Preparación',
  ACTIVE: 'En Curso',
  COMPLETED: 'Finalizado',
};

export default function PublicTournamentsList() {
  const { tournaments, isLoading } = useTournaments();
  const navigate = useNavigate();

  // Filter out Draft tournaments for public view eventually?
  // For now show all but maybe visually distinct.
  const visibleTournaments = tournaments || [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mr-2" />
        Cargando torneos...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Torneos Activos
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Sigue los resultados y la tabla de posiciones de todos nuestros
          torneos de Plato.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleTournaments.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <Trophy className="mx-auto h-16 w-16 opacity-30 mb-4" />
            <p className="text-xl">No hay torneos activos en este momento.</p>
          </div>
        )}

        {/* TODO: Realizar un componente de renderizado de tarjeta de torneo publico */}
        {visibleTournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="group hover:border-indigo-500/50 transition-all cursor-pointer hover:-translate-y-1 duration-300"
            onClick={() => navigate(`/public/tournaments/${tournament.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`
                  px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg
                  ${statusColors[tournament.status]}
                `}
                >
                  {statusLabels[tournament.status]}
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-400 transition-colors">
                {tournament.name}
              </h3>

              <div className="space-y-3 text-sm text-slate-400 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>
                    {tournament.startDate
                      ? format(new Date(tournament.startDate), 'd MMM yyyy', {
                          locale: es,
                        })
                      : 'Próximamente'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>
                    {tournament.config.type === 'CUP'
                      ? 'Modo Copa'
                      : 'Modo Liga'}{' '}
                    • {tournament.config.format}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
