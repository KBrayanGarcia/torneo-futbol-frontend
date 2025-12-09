import type { StepProps } from './types';

export const StepSummary = ({ formData }: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center">Resumen del Torneo</h3>

      <div className="bg-slate-800/50 p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block">Nombre</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Tipo</span>
            <span className="font-medium">
              {formData.type === 'CUP' ? 'Copa' : 'Liga'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Formato</span>
            <span className="font-medium">{formData.format}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Participantes</span>
            <span className="font-medium">
              {formData.format === '1v1'
                ? `${formData.selectedPlayerIds.length} Jugadores`
                : `${formData.selectedTeamIds.length} Equipos`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
