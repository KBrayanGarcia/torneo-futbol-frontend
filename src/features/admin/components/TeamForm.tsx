import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import type { Player } from '../../../types';
import type { TeamFormData } from '../hooks/useTeamMutations';

interface TeamFormProps {
  initialData?: {
    name: string;
    isFixed: boolean;
    playerIds: string[];
  };
  isEditing: boolean;
  players: Player[];
  onSubmit: (data: TeamFormData) => void;
  onCancel: () => void;
}

export function TeamForm({
  initialData,
  isEditing,
  players,
  onSubmit,
  onCancel,
}: TeamFormProps) {
  const [formData, setFormData] = useState<TeamFormData>(
    initialData || { name: '', isFixed: true, playerIds: [] },
  );

  const toggleMember = (playerId: string) => {
    if (formData.playerIds.includes(playerId)) {
      setFormData({
        ...formData,
        playerIds: formData.playerIds.filter((id) => id !== playerId),
      });
    } else {
      setFormData({
        ...formData,
        playerIds: [...formData.playerIds, playerId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Equipo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej. Los Galácticos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Seleccionar Integrantes</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded bg-background">
              {players?.map((player) => (
                <div
                  key={player.id}
                  onClick={() => toggleMember(player.id)}
                  className={`
                    cursor-pointer p-2 rounded flex items-center gap-2 border transition-colors
                    ${
                      formData.playerIds.includes(player.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-accent'
                    }
                  `}
                >
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      formData.playerIds.includes(player.id) ? 'bg-white' : ''
                    }`}
                  />
                  <span className="truncate text-sm">{player.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.playerIds.length} jugadores seleccionados
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Actualizar Equipo' : 'Crear Equipo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
