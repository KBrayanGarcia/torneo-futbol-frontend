import { Shield, ShieldPlus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { usePlayers } from '../../hooks/usePlayers';
import { useTeams } from '../../hooks/useTeams';

import { TeamForm } from './components/TeamForm';
import { TeamList } from './components/TeamList';
import { useTeamFilter } from './hooks/useTeamFilter';
import { useTeamModal } from './hooks/useTeamModal';
import { useTeamMutations } from './hooks/useTeamMutations';

export default function TeamManager() {
  const {
    teams,
    isLoading: isLoadingTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useTeams();
  const { players, isLoading: isLoadingPlayers } = usePlayers();

  const { searchTerm, setSearchTerm, filteredTeams } = useTeamFilter(teams);
  const { isOpen, editingId, openEdit, toggle, close } = useTeamModal();
  const { handleSubmit } = useTeamMutations({
    createTeam: createTeam.mutate,
    updateTeam: updateTeam.mutate,
    onSuccess: close,
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este equipo?')) {
      deleteTeam.mutate(id);
    }
  };

  const editingTeam = teams?.find((t) => t.id === editingId);
  const initialFormData = editingTeam
    ? {
        name: editingTeam.name,
        isFixed: editingTeam.isFixed,
        playerIds: editingTeam.players?.map((p) => p.id) || [],
      }
    : undefined;

  if (isLoadingTeams || isLoadingPlayers) {
    return <div className="p-8 text-center">Cargando equipos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Gestión de Equipos
        </h2>
        <Button onClick={toggle}>
          <ShieldPlus className="w-4 h-4 mr-2" />
          {isOpen ? 'Cancelar' : 'Nuevo Equipo'}
        </Button>
      </div>

      {isOpen && (
        <TeamForm
          initialData={initialFormData}
          isEditing={!!editingId}
          players={players || []}
          onSubmit={(data) => handleSubmit(data, editingId)}
          onCancel={toggle}
        />
      )}

      <div className="relative">
        <div className="absolute left-2.5 top-2.5 text-muted-foreground w-4 h-4">
          {/* Can use Search icon manually or from lucide-react in the import */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <Input
          placeholder="Buscar equipo..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TeamList
        teams={filteredTeams}
        onEdit={(team) => openEdit(team.id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
