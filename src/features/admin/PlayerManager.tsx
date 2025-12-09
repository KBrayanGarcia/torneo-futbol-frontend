import { useState } from "react";
import { usePlayers } from "../../hooks/usePlayers"; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Users, UserPlus, Trash2, Edit2, Search } from "lucide-react";

export default function PlayerManager() {
  const { players, isLoading, createPlayer, updatePlayer, deletePlayer } = usePlayers();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", avatar: "" });

  const resetForm = () => {
    setFormData({ name: "", avatar: "" });
    setEditingPlayer(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingPlayer) {
      updatePlayer.mutate({ 
          id: editingPlayer, 
          data: { name: formData.name, avatar: formData.avatar } 
      });
    } else {
      createPlayer.mutate({ 
          name: formData.name, 
          avatar: formData.avatar,
          stats: {
             matchesPlayed: 0,
             wins: 0,
             goalsScored: 0
          } 
      });
    }
    resetForm();
  };

  const handleEdit = (player: any) => { // TODO: fix any
    setEditingPlayer(player.id);
    setFormData({ name: player.name, avatar: player.avatar || "" });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este jugador?")) {
      deletePlayer.mutate(id);
    }
  };

  const filteredPlayers = players?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div className="p-8 text-center">Cargando jugadores...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Gestión de Jugadores
        </h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {isFormOpen ? "Cancelar" : "Nuevo Jugador"}
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="grid w-full gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Nombre del jugador"
                  required
                />
              </div>
              <div className="grid w-full gap-2">
                 <Label htmlFor="avatar">Avatar URL (Opcional)</Label>
                 <Input 
                   id="avatar" 
                   value={formData.avatar}
                   onChange={e => setFormData({...formData, avatar: e.target.value})}
                   placeholder="https://..."
                 />
              </div>
              <Button type="submit">
                {editingPlayer ? "Actualizar" : "Guardar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jugador..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {player.avatar ? (
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                        <Users className="w-5 h-5 text-slate-400" />
                    )}
                </div>
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(player)}>
                  <Edit2 className="w-4 h-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(player.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredPlayers.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
              No se encontraron jugadores.
          </div>
      )}
    </div>
  );
}
