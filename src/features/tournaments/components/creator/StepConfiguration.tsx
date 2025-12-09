import { Input } from '../../../../components/ui/input';
import type { StepProps } from './types';

export const StepConfiguration = ({ formData, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 border border-slate-700 rounded-lg">
        <div className="flex-1">
          <h4 className="font-medium">Partidos de Ida y Vuelta</h4>
          <p className="text-sm text-slate-400">
            ¿Se jugarán dos partidos por enfrentamiento?
          </p>
        </div>
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600"
          checked={formData.hasReturnLeg}
          onChange={(e) => updateField('hasReturnLeg', e.target.checked)}
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h4 className="font-medium text-indigo-400">
          Programación (Scheduling)
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Inicio</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Fin</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeWeekends"
              className="rounded border-slate-700 bg-slate-800 text-indigo-600"
              checked={formData.excludeWeekends}
              onChange={(e) => updateField('excludeWeekends', e.target.checked)}
            />
            <label htmlFor="excludeWeekends" className="text-sm">
              Excluir Fines de Semana (Sáb/Dom)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dailyMode"
              className="rounded border-slate-700 bg-slate-800 text-indigo-600"
              checked={formData.dailyMode}
              onChange={(e) => updateField('dailyMode', e.target.checked)}
            />
            <label htmlFor="dailyMode" className="text-sm">
              Todos los equipos juegan diariamente (si es posible)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
