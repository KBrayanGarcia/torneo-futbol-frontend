import { Input } from '../../../components/ui/input';

interface MatchScoreInputProps {
  teamName: string;
  score: string;
  onChange: (value: string) => void;
}

export function MatchScoreInput({
  teamName,
  score,
  onChange,
}: MatchScoreInputProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <span className="font-bold text-center h-10 flex items-center justify-center">
        {teamName}
      </span>
      <Input
        type="number"
        min="0"
        className="bg-slate-950 border-slate-700 text-center text-2xl font-mono h-16 w-20"
        value={score}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
