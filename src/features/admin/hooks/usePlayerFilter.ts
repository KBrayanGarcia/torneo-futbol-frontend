import { useState, useMemo } from 'react';
import type { Player } from '../../../types';

export function usePlayerFilter(players: Player[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return (
      players?.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    );
  }, [players, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredPlayers,
  };
}
