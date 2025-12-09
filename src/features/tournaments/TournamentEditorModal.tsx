import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTournaments } from "../../hooks/useTournaments";
import type { Tournament } from "../../types";
import { Settings, Save, X } from "lucide-react";

interface TournamentEditorModalProps {
    tournament: Tournament;
    isOpen: boolean;
    onClose: () => void;
}

export default function TournamentEditorModal({ tournament, isOpen, onClose }: TournamentEditorModalProps) {
    const { updateTournament } = useTournaments();
    const [formData, setFormData] = useState({
        name: tournament.name,
        startDate: tournament.config.startDate || '',
        endDate: tournament.config.endDate || '',
        excludeWeekends: tournament.config.excludedDays?.includes(0) || false,
        dailyMode: tournament.config.schedulingMode === 'DAILY_FOR_ALL',
    });

    if (!isOpen) return null;

    const handleSave = () => {
        updateTournament.mutate({
            id: tournament.id,
            data: {
                name: formData.name,
                config: {
                    ...tournament.config,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    excludedDays: formData.excludeWeekends ? [0, 6] : [],
                    schedulingMode: formData.dailyMode ? 'DAILY_FOR_ALL' : 'DISTRIBUTED'
                }
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-indigo-400" />
                        Editar Configuración
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Nombre del Torneo</label>
                        <Input 
                            value={formData.name} 
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-slate-950/50"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <h4 className="font-medium text-emerald-400 text-sm uppercase tracking-wide">Programación</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Fecha Inicio</label>
                                <Input 
                                    type="date" 
                                    value={formData.startDate} 
                                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))} 
                                    className="bg-slate-950/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400">Fecha Fin</label>
                                <Input 
                                    type="date" 
                                    value={formData.endDate} 
                                    onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))} 
                                    className="bg-slate-950/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                             <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600 transition-colors"
                                    checked={formData.excludeWeekends}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excludeWeekends: e.target.checked }))}
                                />
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Excluir Fines de Semana (Sáb/Dom)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600 transition-colors"
                                    checked={formData.dailyMode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dailyMode: e.target.checked }))}
                                />
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Modo Diario (Todos juegan si es posible)</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 text-xs text-amber-500">
                        Nota: Si cambias la fechas o reglas, recuerda usar el botón <b>Regenerar</b> en el detalle del torneo para aplicar los cambios al calendario de partidos.
                    </div>
                </div>

                <div className="p-4 bg-slate-950/30 border-t border-slate-800 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    );
}
