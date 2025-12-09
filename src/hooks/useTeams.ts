import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Team } from '../types';

// TODO: Por cada acción hay que crear un hook personalizado propio
export const useTeams = () => {
  const queryClient = useQueryClient();

  const {
    data: teams,
    isLoading,
    error,
  } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  const createTeam = useMutation({
    mutationFn: async (newTeam: Partial<Team>) => {
      const response = await api.post('/teams', newTeam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateTeam = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Team> }) => {
      const response = await api.patch(`/teams/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeam = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
  };
};
