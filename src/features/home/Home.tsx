import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { UserCog, Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Administración',
      description: 'Gestionar jugadores, equipos y crear torneos.',
      icon: UserCog,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'group-hover:border-indigo-500/50',
      path: '/tournaments', // Redirects to admin view
    },
    {
      title: 'Ver Torneos',
      description: 'Vista pública de resultados y tablas.',
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'group-hover:border-amber-500/50',
      path: '/public',
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 ">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          PLATO ARENA
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        {menuItems.map((item) => (
          <Card
            key={item.title}
            className={`group cursor-pointer transition-all hover:-translate-y-1 duration-300 border-slate-800 bg-slate-900/50 backdrop-blur ${item.borderColor}`}
            onClick={() => navigate(item.path)}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div
                className={`p-4 rounded-full ${item.bgColor} ${item.color} mb-2 transition-transform group-hover:scale-110 duration-300 shadow-lg shadow-black/20`}
              >
                <item.icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
