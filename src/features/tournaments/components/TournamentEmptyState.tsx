import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Trophy } from 'lucide-react';

export const TournamentEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
      <Trophy className="mx-auto h-12 w-12 opacity-50 mb-4" />
      <p className="text-lg">No hay torneos creados aún</p>
      <Button variant="link" onClick={() => navigate('/admin/tournaments/new')}>
        Crear el primero
      </Button>
    </div>
  );
};
