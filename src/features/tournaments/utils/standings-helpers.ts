import type { Team } from '../../../types';

/**
 * Determines if two teams are in a strict tie (Points, Goal Difference, Goals Scored).
 * Used to display visual indicators for ties that require manual tie-breaking or are equal.
 *
 * @param team The current team to check
 * @param other The other team (previous or next in the list)
 * @returns true if they have identical ranking stats
 */
export const isStrictTie = (team: Team, other: Team | undefined): boolean => {
  if (!other || !team.stats || !other.stats) return false;

  return (
    team.stats.points === other.stats.points &&
    team.stats.goalDifference === other.stats.goalDifference &&
    team.stats.goalsScored === other.stats.goalsScored
  );
};
