import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardStatsGrid } from '../components/dashboard/DashboardStatsGrid';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';
import type { DashboardStats } from '../components/dashboard/types';

export const DashboardPage = () => {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch stats using configured api instance
      const [tournaments, players, teams] = await Promise.all([
        api.get('/tournaments').then((r) => r.data),
        api.get('/players').then((r) => r.data),
        api.get('/teams').then((r) => r.data),
      ]);

      return {
        tournaments: tournaments.length || 0,
        players: players.length || 0,
        teams: teams.length || 0,
      };
    },
    initialData: { tournaments: 0, players: 0, teams: 0 },
  });

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStatsGrid stats={stats} />
      <DashboardQuickActions />
    </div>
  );
};
