import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Tournament, Match } from '../types';

// TODO: Por cada acción hay que crear un hook personalizado propio
export const useTournaments = () => {
  const queryClient = useQueryClient();

  const {
    data: tournaments,
    isLoading,
    error,
  } = useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const response = await api.get('/tournaments');
      return response.data;
    },
  });

  const createTournament = useMutation({
    mutationFn: async (newTournament: Partial<Tournament>) => {
      const response = await api.post('/tournaments', newTournament);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });

  const generateFixture = useMutation({
    mutationFn: async (tournamentId: string) => {
      const response = await api.post(`/tournaments/${tournamentId}/fixture`);
      return response.data;
    },
    onSuccess: (_data, tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });

  const updateTournament = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Tournament>;
    }) => {
      const response = await api.patch(`/tournaments/${id}`, data);
      return response.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tournament', id] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });

  const updateMatch = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Match> }) => {
      const response = await api.patch(`/matches/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] }); // To update lists
      // Invalidate specific tournament matches if we have the ID, but we usually list matches inside tournament details.
      // A broad invalidation is safer for now.
      queryClient.invalidateQueries({ queryKey: ['tournament'] });
    },
  });

  return {
    tournaments,
    isLoading,
    error,
    createTournament,
    updateTournament,
    generateFixture,
    updateMatch,
  };
};

export const useTournament = (id: string) => {
  return useQuery<Tournament>({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const response = await api.get(`/tournaments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
