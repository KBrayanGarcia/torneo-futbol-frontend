import { Button } from '../../components/ui/button';
import type { Tournament } from '../../types';
import { Settings, Save, X } from 'lucide-react';
import { useTournamentEditor } from './hooks/useTournamentEditor';
import { TournamentEditorForm } from './components/TournamentEditorForm';

interface TournamentEditorModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

export default function TournamentEditorModal({
  tournament,
  isOpen,
  onClose,
}: TournamentEditorModalProps) {
  const { formData, setField, saveChanges } = useTournamentEditor(
    tournament,
    onClose,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            Editar Configuración
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TournamentEditorForm data={formData} onChange={setField} />

        <div className="p-4 bg-slate-950/30 border-t border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={saveChanges}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
