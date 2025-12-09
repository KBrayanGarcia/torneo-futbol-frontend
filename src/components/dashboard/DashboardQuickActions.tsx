import { Trophy, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardQuickActions = () => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-slate-100 mb-4">
        Acciones Rápidas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/tournaments/new"
          className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
        >
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Trophy className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-slate-100">Nuevo Torneo</p>
            <p className="text-sm text-slate-400">Crear torneo</p>
          </div>
        </Link>

        <Link
          to="/admin/teams"
          className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-slate-100">Gestionar Equipos</p>
            <p className="text-sm text-slate-400">Ver todos</p>
          </div>
        </Link>

        <Link
          to="/admin/players"
          className="flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
        >
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Users className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-slate-100">Gestionar Jugadores</p>
            <p className="text-sm text-slate-400">Ver todos</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
