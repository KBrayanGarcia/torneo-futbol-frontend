import { Input } from '../../../components/ui/input';

interface TournamentEditorFormData {
  name: string;
  startDate: string;
  endDate: string;
  excludeWeekends: boolean;
  dailyMode: boolean;
}

interface TournamentEditorFormProps {
  data: TournamentEditorFormData;
  onChange: <K extends keyof TournamentEditorFormData>(
    field: K,
    value: TournamentEditorFormData[K],
  ) => void;
}

export function TournamentEditorForm({
  data,
  onChange,
}: TournamentEditorFormProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Nombre del Torneo
        </label>
        <Input
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="bg-slate-950/50"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="font-medium text-emerald-400 text-sm uppercase tracking-wide">
          Programación
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Fecha Inicio
            </label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="bg-slate-950/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Fecha Fin
            </label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="bg-slate-950/50"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600 transition-colors"
              checked={data.excludeWeekends}
              onChange={(e) => onChange('excludeWeekends', e.target.checked)}
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Excluir Fines de Semana (Sáb/Dom)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600 transition-colors"
              checked={data.dailyMode}
              onChange={(e) => onChange('dailyMode', e.target.checked)}
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Modo Diario (Todos juegan si es posible)
            </span>
          </label>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 text-xs text-amber-500">
        Nota: Si cambias la fechas o reglas, recuerda usar el botón{' '}
        <b>Regenerar</b> en el detalle del torneo para aplicar los cambios al
        calendario de partidos.
      </div>
    </div>
  );
}
