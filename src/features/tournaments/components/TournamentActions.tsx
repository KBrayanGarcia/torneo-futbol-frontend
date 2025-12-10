import { Settings, Edit3, RefreshCw, PlayCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface TournamentActionsProps {
  matchCount: number;
  onConfigOpen: () => void;
  onFixtureEdit: () => void;
  onGenerate: () => void;
}

export function TournamentActions({
  matchCount,
  onConfigOpen,
  onFixtureEdit,
  onGenerate,
}: TournamentActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onConfigOpen}
        title="Configuración"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Button variant="outline" onClick={onFixtureEdit}>
        <Edit3 className="mr-2 h-4 w-4" />
        Editor Manual
      </Button>

      <Button
        onClick={onGenerate}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        {matchCount > 0 ? (
          <RefreshCw className="mr-2 h-4 w-4" />
        ) : (
          <PlayCircle className="mr-2 h-4 w-4" />
        )}
        {matchCount > 0 ? 'Regenerar' : 'Generar Auto'}
      </Button>
    </div>
  );
}
