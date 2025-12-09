import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Trophy, Calendar as CalendarIcon } from 'lucide-react';
import type { StepProps } from './types';

export const StepTypeFormat = ({ formData, updateField }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre del Torneo</label>
        <Input
          placeholder="Ej: Copa Mundial Plato 2024"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`
            cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-800
            ${
              formData.type === 'CUP'
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 bg-slate-900'
            }
          `}
          onClick={() => updateField('type', 'CUP')}
        >
          <Trophy className="h-8 w-8 mb-2 text-amber-400" />
          <h3 className="font-bold">Modo Copa</h3>
          <p className="text-xs text-slate-400 mt-1">
            Eliminatoria directa, grupos y finales.
          </p>
        </div>

        <div
          className={`
            cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-800
            ${
              formData.type === 'LEAGUE'
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 bg-slate-900'
            }
          `}
          onClick={() => updateField('type', 'LEAGUE')}
        >
          <CalendarIcon className="h-8 w-8 mb-2 text-emerald-400" />
          <h3 className="font-bold">Modo Liga</h3>
          <p className="text-xs text-slate-400 mt-1">
            Todos contra todos, tabla de posiciones.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Formato de Equipos</label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={formData.format === '1v1' ? 'default' : 'outline'}
            onClick={() => updateField('format', '1v1')}
            className="flex-1"
          >
            1 vs 1
          </Button>
          <Button
            type="button"
            variant={formData.format === '2v2' ? 'default' : 'outline'}
            onClick={() => updateField('format', '2v2')}
            className="flex-1"
          >
            2 vs 2
          </Button>
        </div>
      </div>
    </div>
  );
};
