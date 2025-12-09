import type { TournamentType, TournamentFormat } from '../../../../types';

export interface TournamentFormData {
  name: string;
  type: TournamentType;
  format: TournamentFormat;
  hasReturnLeg: boolean;
  selectedTeamIds: string[];
  selectedPlayerIds: string[];
  startDate: string;
  endDate: string;
  excludeWeekends: boolean;
  dailyMode: boolean;
}

export interface StepProps {
  formData: TournamentFormData;
  updateField: (key: string, value: any) => void;
}
