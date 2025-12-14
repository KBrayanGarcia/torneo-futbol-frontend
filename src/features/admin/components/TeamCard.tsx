import { Edit2, Trash2, Users } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { Team } from '../../../types';

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
              {team.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold">{team.name}</h3>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {team.players?.length || 0} integrantes
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(team)}
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(team.id)}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {team.players?.slice(0, 3).map((p) => (
            <Badge
              key={p.id}
              variant="secondary"
              className="text-xs font-normal"
            >
              {p.name}
            </Badge>
          ))}
          {(team.players?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(team.players?.length || 0) - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
