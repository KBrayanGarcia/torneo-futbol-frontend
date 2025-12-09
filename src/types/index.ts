export type PlayerId = string;
export type TeamId = string;
export type TournamentId = string;
export type MatchId = string;

export interface User {
  id: string;
  username: string;
}

export interface Player {
  id: PlayerId;
  name: string;
  avatar?: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    goalsScored: number;
  };
  createdAt: string;
}

export interface Team {
  id: TeamId;
  name: string;
  players: Player[]; // Full player objects from backend relations
  isFixed: boolean;
  stats?: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
}

export type TournamentFormat = '1v1' | '2v2';
export type TournamentType = 'CUP' | 'LEAGUE';
export type TournamentStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED';

export interface TournamentConfig {
  format: TournamentFormat;
  type: TournamentType;
  hasReturnLeg: boolean;
  playersPerTeam: number;
  startDate?: string;
  endDate?: string;
  schedulingMode?: 'DAILY_FOR_ALL' | 'DISTRIBUTED';
  excludedDays?: number[];
}

export interface Tournament {
  id: TournamentId;
  name: string;
  config: TournamentConfig;
  status: TournamentStatus;
  participants: Team[];
  matches?: Match[]; // Backend relation
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export type MatchStatus = 'SCHEDULED' | 'PLAYED' | 'CANCELLED';

export interface MatchScore {
  home: number;
  away: number;
}

export interface Match {
  id: MatchId;
  tournamentId: TournamentId;
  homeTeamId?: TeamId;
  awayTeamId?: TeamId;
  homeTeam?: Team;
  awayTeam?: Team;
  score?: MatchScore;
  date: string;
  status: MatchStatus;
  round?: number; // Para ligas (jornada) o copas (fase)
  phase?: string; // "Group", "QuarterFinals", "SemiFinals", "Final"
}
