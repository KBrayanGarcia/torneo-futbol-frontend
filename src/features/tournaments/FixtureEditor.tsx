import { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GripVertical, Plus, Trash2, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Team, Match, Tournament } from '../../types';

interface FixtureEditorProps {
    tournament: Tournament;
    onSave: (matches: Match[]) => void;
    onCancel: () => void;
}

// Draggable Team Item
function DraggableTeam({ team }: { team: Team }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: team.id,
        data: { team }
    });
    
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className="p-3 bg-slate-800 rounded border border-slate-700 flex items-center gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-500 z-10"
        >
            <GripVertical className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">{team.name}</span>
        </div>
    );
}

// Droppable Slot
function MatchSlot({ id, team, placeholder, onRemove }: { id: string, team?: Team, placeholder: string, onRemove?: () => void }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div 
            ref={setNodeRef} 
            className={`
                h-12 rounded border-2 border-dashed flex items-center justify-center transition-colors
                ${isOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50'}
                ${team ? 'border-solid border-slate-700 bg-slate-800' : ''}
            `}
        >
            {team ? (
                <div className="flex items-center gap-2 w-full px-3">
                    <span className="text-sm font-medium flex-1 truncate">{team.name}</span>
                    {onRemove && (
                        <button onClick={onRemove} className="text-slate-500 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <span className="text-xs text-slate-600">{placeholder}</span>
            )}
        </div>
    );
}

export default function FixtureEditor({ tournament, onSave, onCancel }: FixtureEditorProps) {
    const { teams } = useStore();
    const tournamentTeams = teams.filter(t => tournament.participants.some(p => p.id === t.id));
    
    // State for matches being built
    const [matches, setMatches] = useState<{id: string, home: string | null, away: string | null}[]>([
        { id: crypto.randomUUID(), home: null, away: null } 
    ]);

    // Derived state: Available teams (in pool)
    const assignedTeamIds = matches.flatMap(m => [m.home, m.away]).filter(Boolean) as string[];
    const availableTeams = tournamentTeams.filter(t => !assignedTeamIds.includes(t.id));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const teamId = active.id as string;
        const [matchId, position] = (over.id as string).split(':'); // Format: "match-uuid:home"

        if (matchId && (position === 'home' || position === 'away')) {
            setMatches(prev => prev.map(m => {
                if (m.id === matchId) {
                    return { ...m, [position]: teamId };
                }
                return m;
            }));
        }
    };

    const removeTeamFromMatch = (matchId: string, position: 'home' | 'away') => {
        setMatches(prev => prev.map(m => {
            if (m.id === matchId) return { ...m, [position]: null };
            return m;
        }));
    };

    const addNewMatch = () => {
        setMatches([...matches, { id: crypto.randomUUID(), home: null, away: null }]);
    };

    const handleSave = () => {
        const validMatches = matches.filter(m => m.home && m.away).map(m => ({
            id: m.id,
            tournamentId: tournament.id,
            homeTeamId: m.home!,
            awayTeamId: m.away!,
            date: new Date().toISOString(),
            status: 'SCHEDULED',
            round: 1
        } as Match));

        onSave(validMatches);
    };

    const [activeDragItem, setActiveDragItem] = useState<Team | null>(null);

    return (
        <DndContext 
            onDragStart={(e) => setActiveDragItem(e.active.data.current?.team || tournamentTeams.find(t => t.id === e.active.id))} 
            onDragEnd={(e) => { handleDragEnd(e); setActiveDragItem(null); }}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Editor Manual de Partidos</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Pool of Teams */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardContent className="p-4 space-y-4">
                            <h4 className="font-medium text-sm text-slate-400 uppercase">Disponibles ({availableTeams.length})</h4>
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {availableTeams.map(team => (
                                    <DraggableTeam key={team.id} team={team} />
                                ))}
                                {availableTeams.length === 0 && (
                                    <p className="text-sm text-slate-500 italic">Todos asignados</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Match Slots */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm text-slate-400 uppercase">Partidos ({matches.length})</h4>
                            <Button size="sm" variant="secondary" onClick={addNewMatch}>
                                <Plus className="mr-2 h-4 w-4" /> Agregar Partido
                            </Button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                            {matches.map((match, idx) => (
                                <div key={match.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-2">
                                    <div className="font-mono text-slate-500 text-sm w-6">{idx + 1}</div>
                                    <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                                        <MatchSlot 
                                            id={`${match.id}:home`} 
                                            team={tournamentTeams.find(t => t.id === match.home)} 
                                            placeholder="Local"
                                            onRemove={match.home ? () => removeTeamFromMatch(match.id, 'home') : undefined}
                                        />
                                        <div className="text-center text-xs font-bold text-slate-600">VS</div>
                                        <MatchSlot 
                                            id={`${match.id}:away`} 
                                            team={tournamentTeams.find(t => t.id === match.away)} 
                                            placeholder="Visita"
                                            onRemove={match.away ? () => removeTeamFromMatch(match.id, 'away') : undefined}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setMatches(prev => prev.filter(m => m.id !== match.id))} 
                                        className="text-slate-600 hover:text-red-400 p-1"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeDragItem ? (
                        <div className="p-3 bg-indigo-600 text-white rounded shadow-2xl flex items-center gap-2 w-48">
                            <GripVertical className="h-4 w-4" />
                            <span className="font-bold">{activeDragItem.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
