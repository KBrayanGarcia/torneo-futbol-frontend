import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Users } from 'lucide-react';
import type { Player, Team } from '../../../../types';
import type { StepProps } from './types';

interface StepParticipantsProps extends StepProps {
  players: Player[];
  teams: Team[];
}

export const StepParticipants = ({
  formData,
  updateField,
  players,
  teams,
}: StepParticipantsProps) => {
  const navigate = useNavigate();
  const is1v1 = formData.format === '1v1';

  const togglePlayer = (id: string) => {
    const current = formData.selectedPlayerIds;
    const newSelection = current.includes(id)
      ? current.filter((pid) => pid !== id)
      : [...current, id];
    updateField('selectedPlayerIds', newSelection);
  };

  const toggleTeam = (id: string) => {
    const current = formData.selectedTeamIds;
    const newSelection = current.includes(id)
      ? current.filter((tid) => tid !== id)
      : [...current, id];
    updateField('selectedTeamIds', newSelection);
  };

  const EmptyState = ({
    message,
    actionText,
    actionPath,
  }: {
    message: string;
    actionText: string;
    actionPath: string;
  }) => (
    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center space-y-3">
      <p className="text-slate-500">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (confirm('Salir del asistente? Perderás los datos actuales.')) {
            navigate(actionPath);
          }
        }}
      >
        <Users className="mr-2 h-4 w-4" />
        {actionText}
      </Button>
    </div>
  );

  const SelectableItem = ({
    name,
    isSelected,
    onToggle,
  }: {
    name: string;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <div
      onClick={onToggle}
      className={`
        cursor-pointer p-3 rounded border text-sm flex items-center gap-3 transition-colors
        ${
          isSelected
            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
        }
      `}
    >
      <Users className="h-4 w-4" />
      {name}
    </div>
  );

  const renderContent = () => {
    // 1v1 Mode: Players List
    if (is1v1) {
      if (players.length === 0) {
        return (
          <EmptyState
            message="No hay jugadores registrados."
            actionText="Ir a registrar jugadores"
            actionPath="/admin/players"
          />
        );
      }
      return players.map((player) => (
        <SelectableItem
          key={player.id}
          name={player.name}
          isSelected={formData.selectedPlayerIds.includes(player.id)}
          onToggle={() => togglePlayer(player.id)}
        />
      ));
    }

    // Teams Mode
    const fixedTeams = teams.filter((t) => t.isFixed);
    if (fixedTeams.length === 0) {
      return (
        <EmptyState
          message="No hay equipos registrados."
          actionText="Ir a registrar equipos"
          actionPath="/admin/teams"
        />
      );
    }
    return fixedTeams.map((team) => (
      <SelectableItem
        key={team.id}
        name={team.name}
        isSelected={formData.selectedTeamIds.includes(team.id)}
        onToggle={() => toggleTeam(team.id)}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {is1v1 ? 'Seleccionar Jugadores' : 'Seleccionar Equipos'}
        </h3>
        <span className="text-xs text-slate-400">
          {is1v1
            ? `${formData.selectedPlayerIds.length} seleccionados`
            : `${formData.selectedTeamIds.length} seleccionados`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto p-2 border border-slate-800 rounded">
        {renderContent()}
      </div>
    </div>
  );
};
