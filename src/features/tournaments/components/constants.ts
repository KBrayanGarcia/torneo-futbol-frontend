import type { TournamentStatus } from '../../../types';

export const STATUS_COLORS: Record<TournamentStatus, string> = {
  DRAFT: 'bg-slate-500',
  ACTIVE: 'bg-emerald-500',
  COMPLETED: 'bg-indigo-500',
};

export const STATUS_LABELS: Record<TournamentStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'En Curso',
  COMPLETED: 'Finalizado',
};
