import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export interface PlayerFormData {
  name: string;
  avatar: string;
}

interface PlayerFormProps {
  initialData?: PlayerFormData;
  isEditing?: boolean;
  onSubmit: (data: PlayerFormData) => void;
}

export function PlayerForm({
  initialData,
  isEditing = false,
  onSubmit,
}: PlayerFormProps) {
  const [formData, setFormData] = useState<PlayerFormData>(
    initialData || {
      name: '',
      avatar: '',
    },
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Jugador' : 'Nuevo Jugador'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="grid w-full gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nombre del jugador"
              required
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="avatar">Avatar URL (Opcional)</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <Button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
