import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Team } from '../../../types';

interface DraggableTeamProps {
  team: Team;
}

export function DraggableTeam({ team }: DraggableTeamProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: team.id,
    data: { team },
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
