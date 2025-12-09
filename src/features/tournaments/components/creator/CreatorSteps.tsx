interface CreatorStepsProps {
  currentStep: number;
}

const steps = [
  { id: 0, title: 'Tipo y Formato' },
  { id: 1, title: 'Configuración' },
  { id: 2, title: 'Participantes' },
  { id: 3, title: 'Resumen' },
];

export const CreatorSteps = ({ currentStep }: CreatorStepsProps) => {
  return (
    <div className="flex justify-between relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10" />
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex flex-col items-center gap-2 bg-slate-950 px-2"
        >
          <div
            className={`
            h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
            ${
              currentStep >= step.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }
          `}
          >
            {step.id + 1}
          </div>
          <span
            className={`text-xs ${
              currentStep >= step.id ? 'text-indigo-400' : 'text-slate-600'
            }`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};
