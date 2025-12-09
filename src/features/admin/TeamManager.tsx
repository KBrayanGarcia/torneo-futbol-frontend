import { useState } from "react";
import { useTeams } from "../../hooks/useTeams";
import { usePlayers } from "../../hooks/usePlayers";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Shield, ShieldPlus, Trash2, Edit2, Search, Users } from "lucide-react";
import { Badge } from "../../components/ui/badge";

export default function TeamManager() {
  const { teams, isLoading: isLoadingTeams, createTeam, updateTeam, deleteTeam } = useTeams();
  const { players, isLoading: isLoadingPlayers } = usePlayers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", isFixed: true });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({ name: "", isFixed: true });
    setSelectedMembers([]);
    setEditingTeam(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const teamData = {
        name: formData.name,
        isFixed: formData.isFixed,
        playerIds: selectedMembers // Send IDs to backend
    };

    if (editingTeam) {
      // @ts-ignore - DTO mismatch with Team interface
      updateTeam.mutate({ id: editingTeam, data: teamData });
    } else {
       // @ts-ignore - DTO mismatch with Team interface
      createTeam.mutate(teamData);
    }
    resetForm();
  };

  const handleEdit = (team: any) => {
    setEditingTeam(team.id);
    setFormData({ name: team.name, isFixed: team.isFixed });
    // Map team players to IDs (players are now objects)
    setSelectedMembers(team.players?.map((p: any) => p.id) || []);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este equipo?")) {
      deleteTeam.mutate(id);
    }
  };

  const toggleMember = (playerId: string) => {
    if (selectedMembers.includes(playerId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== playerId));
    } else {
      setSelectedMembers([...selectedMembers, playerId]);
    }
  };

  const filteredTeams = teams?.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoadingTeams || isLoadingPlayers) return <div className="p-8 text-center">Cargando equipos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          Gestión de Equipos
        </h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <ShieldPlus className="w-4 h-4 mr-2" />
          {isFormOpen ? "Cancelar" : "Nuevo Equipo"}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{editingTeam ? "Editar Equipo" : "Nuevo Equipo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Equipo</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ej. Los Galácticos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Seleccionar Integrantes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded bg-background">
                  {players?.map(player => (
                    <div 
                      key={player.id}
                      onClick={() => toggleMember(player.id)}
                      className={`
                        cursor-pointer p-2 rounded flex items-center gap-2 border transition-colors
                        ${selectedMembers.includes(player.id) 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'hover:bg-accent'}
                      `}
                    >
                      <div className={`w-3 h-3 rounded-full border ${selectedMembers.includes(player.id) ? 'bg-white' : ''}`} />
                      <span className="truncate text-sm">{player.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedMembers.length} jugadores seleccionados
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button type="submit">
                  {editingTeam ? "Actualizar Equipo" : "Crear Equipo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipo..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold">{team.name}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {team.players?.length || 0} integrantes
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(team)}>
                    <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(team.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {team.players?.slice(0, 3).map((p: any) => (
                    <Badge key={p.id} variant="secondary" className="text-xs font-normal">
                        {p.name}
                    </Badge>
                ))}
                {(team.players?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">+{(team.players?.length || 0) - 3}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
