import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTournaments } from "../../hooks/useTournaments";
import type { Match } from "../../types";

interface MatchResultModalProps {
    match: Match | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MatchResultModal({ match, isOpen, onClose }: MatchResultModalProps) {
    const { updateMatch } = useTournaments();
    
    // Initialize state
    const [homeScore, setHomeScore] = useState("");
    const [awayScore, setAwayScore] = useState("");

    // Update state when match changes
    useEffect(() => {
        if (match) {
            setHomeScore(match.score?.home?.toString() || "");
            setAwayScore(match.score?.away?.toString() || "");
        }
    }, [match]);

    if (!match) return null;

    // Use nested objects from backend relation
    // Fallback names if relation is missing (shouldn't happen with correct findOne)
    const homeName = match.homeTeam?.name || "Local";
    const awayName = match.awayTeam?.name || "Visitante";

    const handleSave = () => {
        const hScore = parseInt(homeScore);
        const aScore = parseInt(awayScore);

        if (isNaN(hScore) || isNaN(aScore)) return;

        updateMatch.mutate({
            id: match.id,
            data: {
                score: { home: hScore, away: aScore },
                status: 'PLAYED'
            }
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Registrar Resultado</DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        Ingresa el marcador final del partido
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between gap-4 py-6">
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-bold text-center h-10 flex items-center justify-center">{homeName}</span>
                        <Input
                            type="number"
                            min="0"
                            className="bg-slate-950 border-slate-700 text-center text-2xl font-mono h-16 w-20"
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                        />
                    </div>

                    <div className="text-slate-500 font-bold text-xl px-2">- VS -</div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-bold text-center h-10 flex items-center justify-center">{awayName}</span>
                        <Input
                            type="number"
                            min="0"
                            className="bg-slate-950 border-slate-700 text-center text-2xl font-mono h-16 w-20"
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                    <Button variant="outline" onClick={onClose} className="border-slate-700 hover:bg-slate-800 hover:text-white">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                        disabled={homeScore === "" || awayScore === ""}
                    >
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
