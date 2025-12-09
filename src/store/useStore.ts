import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Team, Tournament, Match, PlayerId, TeamId, MatchId } from '../types';

interface AppState {
    players: Player[];
    teams: Team[];
    tournaments: Tournament[];

    // Player Actions
    addPlayer: (player: Player) => void;
    updatePlayer: (id: PlayerId, data: Partial<Player>) => void;
    deletePlayer: (id: PlayerId) => void;

    // Team Actions
    addTeam: (team: Team) => void;
    updateTeam: (id: TeamId, data: Partial<Team>) => void;
    deleteTeam: (id: TeamId) => void;

    // Tournament Actions
    addTournament: (tournament: Tournament) => void;
    updateTournament: (id: string, data: Partial<Tournament>) => void;

    // Match Actions
    matches: Match[];
    setMatches: (matches: Match[]) => void;
    setAllMatches: (matches: Match[]) => void;
    updateMatch: (id: MatchId, data: Partial<Match>) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            players: [],
            teams: [],
            tournaments: [],

            addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
            updatePlayer: (id, data) => set((state) => ({
                players: state.players.map((p) => (p.id === id ? { ...p, ...data } : p)),
            })),
            deletePlayer: (id) => set((state) => ({
                players: state.players.filter((p) => p.id !== id),
            })),

            addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
            updateTeam: (id, data) => set((state) => ({
                teams: state.teams.map((t) => (t.id === id ? { ...t, ...data } : t)),
            })),
            deleteTeam: (id) => set((state) => ({
                teams: state.teams.filter((t) => t.id !== id),
            })),

            addTournament: (tournament) => set((state) => ({ tournaments: [...state.tournaments, tournament] })),
            updateTournament: (id, data) => set((state) => ({
                tournaments: state.tournaments.map((t) => (t.id === id ? { ...t, ...data } : t)),
            })),

            matches: [],
            setMatches: (newMatches) => set((state) => ({ matches: [...state.matches, ...newMatches] })),
            setAllMatches: (matches) => set({ matches }),
            updateMatch: (id, data) => set((state) => ({
                matches: state.matches.map((m) => (m.id === id ? { ...m, ...data } : m)),
            })),
        }),
        {
            name: 'plato-tournament-storage',
        }
    )
);
