import { Trophy, Users, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardStats } from './types';

interface DashboardStatsGridProps {
  stats: DashboardStats | undefined;
}

export const DashboardStatsGrid = ({ stats }: DashboardStatsGridProps) => {
  const statCards = [
    {
      title: 'Torneos Activos',
      value: stats?.tournaments || 0,
      icon: Trophy,
      color: 'from-indigo-500 to-purple-600',
      link: '/admin/tournaments',
    },
    {
      title: 'Equipos Registrados',
      value: stats?.teams || 0,
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
      link: '/admin/teams',
    },
    {
      title: 'Jugadores',
      value: stats?.players || 0,
      icon: Users,
      color: 'from-orange-500 to-red-600',
      link: '/admin/players',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            to={card.link}
            className="group relative bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
          >
            {/* Background gradient */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-linear-to-br ${card.color} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-slate-600 group-hover:text-slate-500 transition-colors" />
              </div>

              <p className="text-sm text-slate-400 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-slate-100">{card.value}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
