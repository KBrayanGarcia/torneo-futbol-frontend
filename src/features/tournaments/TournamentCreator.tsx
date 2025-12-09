import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useStore } from "../../store/useStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Trophy, Users, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import type { TournamentType, TournamentFormat } from "../../types";
import { useTournaments } from "../../hooks/useTournaments";
import { useTeams } from "../../hooks/useTeams";
import { usePlayers } from "../../hooks/usePlayers";

const steps = [
  { id: 0, title: "Tipo y Formato" },
  { id: 1, title: "Configuración" },
  { id: 2, title: "Participantes" },
  { id: 3, title: "Resumen" },
];



export default function TournamentCreator() {
  const navigate = useNavigate();
  // const { teams, players } = useStore(); // Deprecated
  const { teams: teamsData } = useTeams();
  const teams = teamsData || [];
  
  const { players: playersData } = usePlayers();
  const players = playersData || [];
  
  const { createTournament } = useTournaments();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    type: 'CUP' as TournamentType,
    format: '1v1' as TournamentFormat,
    hasReturnLeg: false,
    selectedTeamIds: [] as string[],
    selectedPlayerIds: [] as string[],
    startDate: '',
    endDate: '',
    excludeWeekends: false,
    dailyMode: false,
  });

  const updateField = (key: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    try {
      let participants: any[] = [];

      if (formData.format === '1v1') {
        // Create new temporary teams for 1v1
        participants = formData.selectedPlayerIds.map(playerId => {
          const player = players.find(p => p.id === playerId);
          if (!player) throw new Error(`Player ${playerId} not found`);
          
          return {
             name: player.name,
             isFixed: false,
             players: [{ id: player.id }],
             stats: {} 
          };
        });
      } else {
        // Link existing teams
        participants = formData.selectedTeamIds.map(tid => ({ id: tid }));
      }

      await createTournament.mutateAsync({
        name: formData.name,
        config: {
          type: formData.type,
          format: formData.format,
          hasReturnLeg: formData.hasReturnLeg,
          playersPerTeam: formData.format === '1v1' ? 1 : 2,
          startDate: formData.startDate,
          endDate: formData.endDate,
          excludedDays: formData.excludeWeekends ? [0, 6] : [],
          schedulingMode: formData.dailyMode ? 'DAILY_FOR_ALL' : 'DISTRIBUTED'
        },
        participants: participants,
      });

      navigate('/tournaments');
    } catch (error) {
      console.error("Failed to create tournament:", error);
      alert("Error al crear el torneo. Revisa la consola.");
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 0) return !formData.name;
    // Add validations defined by step
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Torneo</h2>
        <p className="text-slate-400">Configura las reglas y participantes.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10" />
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}
            `}>
              {step.id + 1}
            </div>
            <span className={`text-xs ${currentStep >= step.id ? 'text-indigo-400' : 'text-slate-600'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Torneo</label>
                <Input 
                  placeholder="Ej: Copa Mundial Plato 2024" 
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`
                    cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-800
                    ${formData.type === 'CUP' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'}
                  `}
                  onClick={() => updateField('type', 'CUP')}
                >
                  <Trophy className="h-8 w-8 mb-2 text-amber-400" />
                  <h3 className="font-bold">Modo Copa</h3>
                  <p className="text-xs text-slate-400 mt-1">Eliminatoria directa, grupos y finales.</p>
                </div>

                <div 
                  className={`
                    cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-800
                    ${formData.type === 'LEAGUE' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'}
                  `}
                  onClick={() => updateField('type', 'LEAGUE')}
                >
                  <CalendarIcon className="h-8 w-8 mb-2 text-emerald-400" />
                  <h3 className="font-bold">Modo Liga</h3>
                  <p className="text-xs text-slate-400 mt-1">Todos contra todos, tabla de posiciones.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Formato de Equipos</label>
                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant={formData.format === '1v1' ? 'default' : 'outline'}
                    onClick={() => updateField('format', '1v1')}
                    className="flex-1"
                  >
                    1 vs 1
                  </Button>
                  <Button 
                    type="button"
                    variant={formData.format === '2v2' ? 'default' : 'outline'}
                    onClick={() => updateField('format', '2v2')}
                    className="flex-1"
                  >
                    2 vs 2
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
               <div className="flex items-center gap-4 p-4 border border-slate-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Partidos de Ida y Vuelta</h4>
                    <p className="text-sm text-slate-400">¿Se jugarán dos partidos por enfrentamiento?</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600"
                    checked={formData.hasReturnLeg}
                    onChange={(e) => updateField('hasReturnLeg', e.target.checked)}
                  />
               </div>
               
               <div className="flex items-center gap-4 p-4 border border-slate-700 rounded-lg bg-slate-800/20">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200">Partidos de Ida y Vuelta</h4>
                    <p className="text-sm text-slate-400">¿Se jugarán dos partidos por enfrentamiento?</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600"
                    checked={formData.hasReturnLeg}
                    onChange={(e) => updateField('hasReturnLeg', e.target.checked)}
                  />
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-800">
                   <h4 className="font-medium text-indigo-400">Programación (Scheduling)</h4>
                   
                   <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                           <label className="text-sm font-medium">Fecha Inicio</label>
                           <Input type="date" value={formData.startDate} onChange={e => updateField('startDate', e.target.value)} />
                       </div>
                       <div className="space-y-2">
                           <label className="text-sm font-medium">Fecha Fin</label>
                           <Input type="date" value={formData.endDate} onChange={e => updateField('endDate', e.target.value)} />
                       </div>
                   </div>

                   <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <input 
                               type="checkbox" 
                               id="excludeWeekends"
                               className="rounded border-slate-700 bg-slate-800 text-indigo-600"
                               checked={formData.excludeWeekends}
                               onChange={(e) => updateField('excludeWeekends', e.target.checked)}
                           />
                           <label htmlFor="excludeWeekends" className="text-sm">Excluir Fines de Semana (Sáb/Dom)</label>
                       </div>
                       <div className="flex items-center gap-2">
                           <input 
                               type="checkbox" 
                               id="dailyMode"
                               className="rounded border-slate-700 bg-slate-800 text-indigo-600"
                               checked={formData.dailyMode}
                               onChange={(e) => updateField('dailyMode', e.target.checked)}
                           />
                           <label htmlFor="dailyMode" className="text-sm">Todos los equipos juegan diariamente (si es posible)</label>
                       </div>
                   </div>
               </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-medium">
                    {formData.format === '1v1' ? 'Seleccionar Jugadores' : 'Seleccionar Equipos'}
                 </h3>
                 <span className="text-xs text-slate-400">
                    {formData.format === '1v1' 
                        ? `${formData.selectedPlayerIds.length} seleccionados`
                        : `${formData.selectedTeamIds.length} seleccionados`
                    }
                 </span>
              </div>

              <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto p-2 border border-slate-800 rounded">
                {formData.format === '1v1' ? (
                    // 1v1 Selection Mode - Players
                    players.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <p className="text-slate-500">No hay jugadores registrados.</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    if(confirm("Salir del asistente? Perderás los datos actuales.")) {
                                        navigate('/players');
                                    }
                                }}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Ir a registrar jugadores
                            </Button>
                        </div>
                    ) : (
                        players.map(player => (
                            <div 
                              key={player.id}
                              onClick={() => {
                                 const current = formData.selectedPlayerIds;
                                 if (current.includes(player.id)) {
                                   updateField('selectedPlayerIds', current.filter(id => id !== player.id));
                                 } else {
                                   updateField('selectedPlayerIds', [...current, player.id]);
                                 }
                              }}
                              className={`
                                cursor-pointer p-3 rounded border text-sm flex items-center gap-3 transition-colors
                                ${formData.selectedPlayerIds.includes(player.id)
                                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
                              `}
                            >
                              <Users className="h-4 w-4" />
                              {player.name}
                            </div>
                        ))
                    )
                ) : (
                    // Team Selection Mode
                    teams.filter(t => t.isFixed).length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <p className="text-slate-500">No hay equipos registrados.</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    if(confirm("Salir del asistente? Perderás los datos actuales.")) {
                                        navigate('/teams');
                                    }
                                }}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Ir a registrar equipos
                            </Button>
                        </div>
                    ) : (
                        teams.filter(t => t.isFixed).map(team => (
                          <div 
                            key={team.id}
                            onClick={() => {
                               const current = formData.selectedTeamIds;
                               if (current.includes(team.id)) {
                                 updateField('selectedTeamIds', current.filter(id => id !== team.id));
                               } else {
                                 updateField('selectedTeamIds', [...current, team.id]);
                               }
                            }}
                            className={`
                              cursor-pointer p-3 rounded border text-sm flex items-center gap-3 transition-colors
                              ${formData.selectedTeamIds.includes(team.id)
                                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
                            `}
                          >
                            <Users className="h-4 w-4" />
                            {team.name}
                          </div>
                        ))
                    )
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">Resumen del Torneo</h3>
              
              <div className="bg-slate-800/50 p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Nombre</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tipo</span>
                    <span className="font-medium">{formData.type === 'CUP' ? 'Copa' : 'Liga'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Formato</span>
                    <span className="font-medium">{formData.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Participantes</span>
                    <span className="font-medium">
                        {formData.format === '1v1' 
                            ? `${formData.selectedPlayerIds.length} Jugadores`
                            : `${formData.selectedTeamIds.length} Equipos`
                        }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={isNextDisabled()}
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                Crear Torneo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
