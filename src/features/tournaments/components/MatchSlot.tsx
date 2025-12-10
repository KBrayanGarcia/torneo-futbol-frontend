import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
import type { Team } from '../../../types';

interface MatchSlotProps {
  id: string;
  team?: Team;
  placeholder: string;
  onRemove?: () => void;
}

export function MatchSlot({ id, team, placeholder, onRemove }: MatchSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
                h-12 rounded border-2 border-dashed flex items-center justify-center transition-colors
                ${
                  isOver
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/50'
                }
                ${team ? 'border-solid border-slate-700 bg-slate-800' : ''}
            `}
    >
      {team ? (
        <div className="flex items-center gap-2 w-full px-3">
          <span className="text-sm font-medium flex-1 truncate">
            {team.name}
          </span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-slate-500 hover:text-red-400"
            >
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
