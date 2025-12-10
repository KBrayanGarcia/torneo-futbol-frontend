import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export function TournamentHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Torneos</h2>
        <p className="text-muted-foreground">Gestiona tus torneos de fútbol</p>
      </div>
      <Link to="/tournaments/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Torneo
        </Button>
      </Link>
    </div>
  );
}
