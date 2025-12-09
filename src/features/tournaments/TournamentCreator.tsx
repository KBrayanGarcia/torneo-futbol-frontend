import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { TournamentType, TournamentFormat, Team } from '../../types';
import { useTournaments } from '../../hooks/useTournaments';
import { useTeams } from '../../hooks/useTeams';
import { usePlayers } from '../../hooks/usePlayers';

import { CreatorSteps } from './components/creator/CreatorSteps';
import { StepTypeFormat } from './components/creator/StepTypeFormat';
import { StepConfiguration } from './components/creator/StepConfiguration';
import { StepParticipants } from './components/creator/StepParticipants';
import { StepSummary } from './components/creator/StepSummary';
import type { TournamentFormData } from './components/creator/types';

export default function TournamentCreator() {
  const navigate = useNavigate();
  const { teams: teamsData } = useTeams();
  const teams = teamsData || [];

  const { players: playersData } = usePlayers();
  const players = playersData || [];

  const { createTournament } = useTournaments();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    type: 'CUP' as TournamentType,
    format: '1v1' as TournamentFormat,
    hasReturnLeg: false,
    selectedTeamIds: [],
    selectedPlayerIds: [],
    startDate: '',
    endDate: '',
    excludeWeekends: false,
    dailyMode: false,
  });

  const updateField = (key: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    try {
      type ParticipantInput =
        | { id: string }
        | {
            name: string;
            isFixed: boolean;
            players: { id: string }[];
            stats: Record<string, number>;
          };

      let participants: ParticipantInput[] = [];

      if (formData.format === '1v1') {
        // Create new temporary teams for 1v1
        participants = formData.selectedPlayerIds.map((playerId) => {
          const player = players.find((p) => p.id === playerId);
          if (!player) throw new Error(`Player ${playerId} not found`);

          return {
            name: player.name,
            isFixed: false,
            players: [{ id: player.id }],
            stats: {},
          };
        });
      } else {
        // Link existing teams
        participants = formData.selectedTeamIds.map((tid) => ({ id: tid }));
      }

      await createTournament.mutateAsync({
        name: formData.name,
        config: {
          type: formData.type,
          format: formData.format,
          hasReturnLeg: formData.hasReturnLeg,
          playersPerTeam: formData.format === '1v1' ? 1 : 2,
          startDate: formData.startDate,
          endDate: formData.endDate,
          excludedDays: formData.excludeWeekends ? [0, 6] : [],
          schedulingMode: formData.dailyMode ? 'DAILY_FOR_ALL' : 'DISTRIBUTED',
        },
        participants: participants as unknown as Team[],
      });

      navigate('/admin/tournaments');
    } catch (error) {
      console.error('Failed to create tournament:', error);
      alert('Error al crear el torneo. Revisa la consola.');
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 0) return !formData.name;
    // Add validations defined by step
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Crear Nuevo Torneo
        </h2>
        <p className="text-slate-400">Configura las reglas y participantes.</p>
      </div>

      <CreatorSteps currentStep={currentStep} />

      <Card>
        <CardContent className="p-8">
          {currentStep === 0 && (
            <StepTypeFormat formData={formData} updateField={updateField} />
          )}

          {currentStep === 1 && (
            <StepConfiguration formData={formData} updateField={updateField} />
          )}

          {currentStep === 2 && (
            <StepParticipants
              formData={formData}
              updateField={updateField}
              players={players}
              teams={teams}
            />
          )}

          {currentStep === 3 && (
            <StepSummary formData={formData} updateField={updateField} />
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={isNextDisabled()}
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Crear Torneo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
