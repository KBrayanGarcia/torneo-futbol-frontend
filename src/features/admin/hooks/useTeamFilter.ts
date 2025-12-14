import { useState } from 'react';
import type { Team } from '../../../types';

export function useTeamFilter(teams: Team[] = []) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter((team) => {
    // Filter by name
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by isFixed to show only "real" teams, not auto-generated 1v1 teams
    const isFixedTeam = team.isFixed === true;

    return matchesSearch && isFixedTeam;
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredTeams,
  };
}
