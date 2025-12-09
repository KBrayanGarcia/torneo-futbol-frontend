import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';

export const TournamentHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Torneos
        </h2>
        <p className="text-slate-400">Gestiona tus ligas y copas.</p>
      </div>
      <Button onClick={() => navigate('/admin/tournaments/new')}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Torneo
      </Button>
    </div>
  );
};
