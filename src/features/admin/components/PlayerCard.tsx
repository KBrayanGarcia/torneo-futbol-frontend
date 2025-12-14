import { Edit2, Trash2, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { Player } from '../../../types';

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <span className="font-medium">{player.name}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(player)}>
            <Edit2 className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(player.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
