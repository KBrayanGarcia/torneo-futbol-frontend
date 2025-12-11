import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { MatchScoreInput } from './components/MatchScoreInput';
import { useMatchResult } from './hooks/useMatchResult';
import type { Match } from '../../types';

interface MatchResultModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchResultModal({
  match,
  isOpen,
  onClose,
}: MatchResultModalProps) {
  const {
    homeScore,
    setHomeScore,
    awayScore,
    setAwayScore,
    handleSave,
    isValid,
  } = useMatchResult({ match, onClose });

  if (!match) return null;

  // Use nested objects from backend relation
  // Fallback names if relation is missing (shouldn't happen with correct findOne)
  const homeName = match.homeTeam?.name || 'Local';
  const awayName = match.awayTeam?.name || 'Visitante';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Registrar Resultado
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Ingresa el marcador final del partido
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 py-6">
          <MatchScoreInput
            teamName={homeName}
            score={homeScore}
            onChange={setHomeScore}
          />

          <div className="text-slate-500 font-bold text-xl px-2">- VS -</div>

          <MatchScoreInput
            teamName={awayName}
            score={awayScore}
            onChange={setAwayScore}
          />
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
            disabled={!isValid}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
