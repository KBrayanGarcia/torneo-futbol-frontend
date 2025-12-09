import { useNavigate } from "react-router-dom";
import { useTournaments } from "../../hooks/useTournaments";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Plus, Trophy, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TournamentStatus } from "../../types";

const statusColors: Record<TournamentStatus, string> = {
  'DRAFT': 'bg-slate-500',
  'ACTIVE': 'bg-emerald-500',
  'COMPLETED': 'bg-indigo-500',
};

const statusLabels: Record<TournamentStatus, string> = {
  'DRAFT': 'Borrador',
  'ACTIVE': 'En Curso',
  'COMPLETED': 'Finalizado',
};

export default function TournamentsList() {
  const { tournaments = [], isLoading, error } = useTournaments();
  const navigate = useNavigate();

  if (isLoading) return <div className="text-center py-20">Cargando torneos...</div>;
  if (error) return <div className="text-center py-20 text-red-400">Error al cargar torneos</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Torneos</h2>
          <p className="text-slate-400">Gestiona tus ligas y copas.</p>
        </div>
        <Button onClick={() => navigate("/tournaments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Torneo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
            <Trophy className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <p className="text-lg">No hay torneos creados aún</p>
            <Button variant="link" onClick={() => navigate("/tournaments/new")}>Crear el primero</Button>
          </div>
        )}
        
        {tournaments.map((tournament) => (
          <Card 
            key={tournament.id} 
            className="group hover:border-indigo-500/50 transition-all cursor-pointer"
            onClick={() => navigate(`/tournaments/${tournament.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`
                  px-2 py-1 rounded text-xs font-bold text-white
                  ${statusColors[tournament.status]}
                `}>
                  {statusLabels[tournament.status]}
                </div>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{tournament.name}</h3>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {tournament.startDate 
                      ? format(new Date(tournament.startDate), "d MMM yyyy", { locale: es }) 
                      : "Sin fecha inicio"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {tournament.config.type === 'CUP' ? 'Copa' : 'Liga'} • {tournament.config.format}
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
