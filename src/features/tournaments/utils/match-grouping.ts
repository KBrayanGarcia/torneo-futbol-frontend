import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import type { Match } from '../../../types';
import { parseLocalDate } from '../../../lib/tournament-utils';

export const groupMatchesByDate = (
  matches: Match[],
): Record<string, Match[]> => {
  return matches.reduce((acc, match) => {
    try {
      const dateKey = match.date
        ? format(parseISO(match.date), 'yyyy-MM-dd')
        : 'Sin Fecha';
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(match);
    } catch (e) {
      console.error('Error grouping match:', match, e);
    }
    return acc;
  }, {} as Record<string, Match[]>);
};

export const sortMatchesByTime = (matches: Match[]): Match[] => {
  return [...matches].sort((a, b) => {
    const timeA = a.date ? parseISO(a.date).getTime() : 0;
    const timeB = b.date ? parseISO(b.date).getTime() : 0;
    return timeA - timeB;
  });
};

export const getGroupDateLabel = (dateKey: string, locale: Locale): string => {
  if (dateKey === 'Sin Fecha') return 'Pendientes';
  return format(parseLocalDate(dateKey), "EEEE d 'de' MMMM", { locale });
};
