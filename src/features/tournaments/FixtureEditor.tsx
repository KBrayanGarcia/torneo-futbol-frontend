import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GripVertical, Plus, Trash2, Save } from 'lucide-react';
import type { Match, Tournament } from '../../types';
import { DraggableTeam } from './components/DraggableTeam';
import { MatchSlot } from './components/MatchSlot';
import { useFixtureEditor } from './hooks/useFixtureEditor';

interface FixtureEditorProps {
  tournament: Tournament;
  onSave: (matches: Match[]) => void;
  onCancel: () => void;
}

export default function FixtureEditor({
  tournament,
  onSave,
  onCancel,
}: FixtureEditorProps) {
  const {
    matches,
    availableTeams,
    tournamentTeams,
    activeDragItem,
    setActiveDragItem,
    handleDragEnd,
    addNewMatch,
    removeMatch,
    removeTeamFromMatch,
    handleSave,
  } = useFixtureEditor({ tournament, onSave });

  return (
    <DndContext
      onDragStart={(e) =>
        setActiveDragItem(
          e.active.data.current?.team ||
            tournamentTeams.find((t) => t.id === e.active.id),
        )
      }
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Editor Manual de Partidos</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pool of Teams */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium text-sm text-slate-400 uppercase">
                Disponibles ({availableTeams.length})
              </h4>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {availableTeams.map((team) => (
                  <DraggableTeam key={team.id} team={team} />
                ))}
                {availableTeams.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Todos asignados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Match Slots */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm text-slate-400 uppercase">
                Partidos ({matches.length})
              </h4>
              <Button size="sm" variant="secondary" onClick={addNewMatch}>
                <Plus className="mr-2 h-4 w-4" /> Agregar Partido
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {matches.map((match, idx) => (
                <div
                  key={match.id}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-2"
                >
                  <div className="font-mono text-slate-500 text-sm w-6">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                    <MatchSlot
                      id={`${match.id}:home`}
                      team={tournamentTeams.find((t) => t.id === match.home)}
                      placeholder="Local"
                      onRemove={
                        match.home
                          ? () => removeTeamFromMatch(match.id, 'home')
                          : undefined
                      }
                    />
                    <div className="text-center text-xs font-bold text-slate-600">
                      VS
                    </div>
                    <MatchSlot
                      id={`${match.id}:away`}
                      team={tournamentTeams.find((t) => t.id === match.away)}
                      placeholder="Visita"
                      onRemove={
                        match.away
                          ? () => removeTeamFromMatch(match.id, 'away')
                          : undefined
                      }
                    />
                  </div>
                  <button
                    onClick={() => removeMatch(match.id)}
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
