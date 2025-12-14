import { Search, UserPlus, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { usePlayers } from '../../hooks/usePlayers';
import type { Player } from '../../types';
import { PlayerForm } from './components/PlayerForm';
import { PlayerList } from './components/PlayerList';
import { usePlayerFilter } from './hooks/usePlayerFilter';
import { usePlayerModal } from './hooks/usePlayerModal';
import { usePlayerMutations } from './hooks/usePlayerMutations';

export default function PlayerManager() {
  const { players, isLoading, createPlayer, updatePlayer, deletePlayer } =
    usePlayers();
  const { searchTerm, setSearchTerm, filteredPlayers } =
    usePlayerFilter(players);
  const { isOpen, editingId, openEdit, toggle, close } = usePlayerModal();

  const { handleSubmit } = usePlayerMutations({
    createPlayer: createPlayer.mutate,
    updatePlayer: updatePlayer.mutate,
    onSuccess: close,
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este jugador?')) {
      deletePlayer.mutate(id);
    }
  };

  const editingPlayerData = players?.find((p) => p.id === editingId);
  const initialFormData = editingPlayerData
    ? { name: editingPlayerData.name, avatar: editingPlayerData.avatar || '' }
    : undefined;

  if (isLoading)
    return <div className="p-8 text-center">Cargando jugadores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Gestión de Jugadores
        </h2>
        <Button onClick={toggle}>
          <UserPlus className="w-4 h-4 mr-2" />
          {isOpen ? 'Cancelar' : 'Nuevo Jugador'}
        </Button>
      </div>

      {isOpen && (
        <PlayerForm
          key={editingId || 'new'}
          initialData={initialFormData}
          isEditing={!!editingId}
          onSubmit={(data) => handleSubmit(data, editingId)}
        />
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jugador..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <PlayerList
        players={filteredPlayers}
        onEdit={(player: Player) => openEdit(player.id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
