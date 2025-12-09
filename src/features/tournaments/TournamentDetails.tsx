import { useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar, Users, Trophy, PlayCircle, Edit3, RefreshCw, Settings } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { parseLocalDate } from "../../lib/tournament-utils";
import { cn } from "../../lib/utils";
import FixtureEditor from "./FixtureEditor";
import TournamentEditorModal from "./TournamentEditorModal";
import StandingsTable from "./StandingsTable";
import MatchList from "./MatchList";
import MatchResultModal from "./MatchResultModal";
import type { Match } from "../../types";

import { useTournament, useTournaments } from "../../hooks/useTournaments";

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const { generateFixture } = useTournaments();
  const { data: tournament, isLoading, error } = useTournament(id!);
  
  // Local state for UI interactions
  const [isEditingFixture, setIsEditingFixture] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  if (isLoading) return <div className="text-center py-20">Cargando detalles...</div>;
  if (error || !tournament) return <div className="text-center py-20 text-red-500">Error al cargar torneo</div>;

  // With the backend relation, matches come inside the tournament object
  const tournamentMatches = tournament.matches || [];
  console.log('Tournament Details Render:', { 
      id: tournament.id, 
      matchesCount: tournamentMatches.length, 
      matches: tournamentMatches 
  });

  const handleGenerateValues = () => {
    if (confirm("¿Generar fixture automáticamente? Esto borrará partidos existentes.")) {
        generateFixture.mutate(id!, {
            onSuccess: () => {
                // Force a refetch of the tournament details to get the new matches
                // queryClient.invalidateQueries({ queryKey: ['tournament', id] }); // Already in hook, but let's be sure UI updates
                window.location.reload(); // Temporary brute force to confirm if it's a state update issue vs backend issue
            }
        });
    }
  };
  
  const handleSaveManualFixture = () => alert("En construcción");
  
  if (isEditingFixture) {
      return (
          <FixtureEditor 
             tournament={tournament} 
             onSave={handleSaveManualFixture}
             onCancel={() => setIsEditingFixture(false)}
          />
      );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ... Header info ... */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight">{tournament.name}</h2>
            <div className={cn(
                "px-2 py-0.5 rounded text-xs font-bold text-white",
                tournament.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-500'
            )}>
                {tournament.status === 'ACTIVE' ? 'En Curso' : 'Borrador'}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
             <div className="flex items-center gap-2">
               <Trophy className="h-4 w-4 text-amber-500" />
               <span>{tournament.config.type === 'CUP' ? 'Copa' : 'Liga'}</span>
             </div>
             <div className="flex items-center gap-2">
               <Users className="h-4 w-4 text-indigo-400" />
               <span>{tournament.config.format} ({tournament.participants.length} equipos)</span>
             </div>
             <div className="flex items-center gap-2">
               <Calendar className="h-4 w-4 text-emerald-400" />
                <span>
                 {tournament.config.startDate 
                    ? `Inicio: ${format(parseLocalDate(tournament.config.startDate), "d MMM", { locale: es })}`
                    : `Creado: ${format(new Date(tournament.createdAt), "d MMM", { locale: es })}`
                 }
                </span>
             </div>
          </div>
        </div>
        
        <div className="flex gap-2">
           <Button variant="outline" size="icon" onClick={() => setIsConfigOpen(true)} title="Configuración">
             <Settings className="h-4 w-4" />
           </Button>

           <Button variant="outline" onClick={() => setIsEditingFixture(true)}>
             <Edit3 className="mr-2 h-4 w-4" />
             Editor Manual
           </Button>
           
           <Button onClick={handleGenerateValues} className="bg-indigo-600 hover:bg-indigo-700">
              {tournamentMatches.length > 0 ? <RefreshCw className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
              {tournamentMatches.length > 0 ? 'Regenerar' : 'Generar Auto'}
           </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
               <CardTitle>Partidos</CardTitle>
            </CardHeader>
            <CardContent>
                <MatchList 
                    matches={tournamentMatches} 
                    teams={tournament.participants} 
                    onMatchClick={(m) => setSelectedMatch(m)}
                />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Posiciones</CardTitle>
               </CardHeader>
               <CardContent>
                 <StandingsTable participants={tournament.participants} matches={tournamentMatches} />
               </CardContent>
            </Card>
        </div>
      </div>

      <TournamentEditorModal
         tournament={tournament}
         isOpen={isConfigOpen}
         onClose={() => setIsConfigOpen(false)}
      />
      
      <MatchResultModal
         key={selectedMatch?.id}
         match={selectedMatch}
         isOpen={!!selectedMatch}
         onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
