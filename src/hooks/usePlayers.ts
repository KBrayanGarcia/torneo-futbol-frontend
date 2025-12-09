import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Player } from '../types';

export const usePlayers = () => {
    const queryClient = useQueryClient();

    const { data: players, isLoading, error } = useQuery<Player[]>({
        queryKey: ['players'],
        queryFn: async () => {
            const response = await api.get('/players');
            return response.data;
        },
    });

    const createPlayer = useMutation({
        mutationFn: async (newPlayer: Partial<Player>) => {
            const response = await api.post('/players', newPlayer);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });

    const updatePlayer = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Player> }) => {
            const response = await api.patch(`/players/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });

    const deletePlayer = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/players/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });

    return {
        players,
        isLoading,
        error,
        createPlayer,
        updatePlayer,
        deletePlayer,
    };
};
