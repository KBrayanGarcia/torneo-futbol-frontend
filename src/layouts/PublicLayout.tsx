import { Link, Outlet } from 'react-router-dom';
import { Trophy, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Public Header */}
      <header className="h-16 border-b border-slate-800 flex items-center px-4 lg:px-8 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/public" className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Plato Torneos
          </span>
        </Link>

        <div className="ml-auto">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-400 hover:text-white"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Administración</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 Plato Torneos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
