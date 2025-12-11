export const StandingsTableHeader = () => {
  return (
    <thead className="bg-slate-800 text-slate-400 font-medium">
      <tr>
        <th className="px-3 py-2 rounded-tl-lg">Pos</th>
        <th className="px-3 py-2 w-full">Equipo</th>
        <th className="px-3 py-2 text-center">PJ</th>
        <th className="px-3 py-2 text-center text-emerald-400">G</th>
        <th className="px-3 py-2 text-center text-amber-400">E</th>
        <th className="px-3 py-2 text-center text-rose-400">P</th>
        <th className="px-3 py-2 text-center">GF</th>
        <th className="px-3 py-2 text-center">GC</th>
        <th className="px-3 py-2 text-center">DG</th>
        <th className="px-3 py-2 text-center font-bold text-white rounded-tr-lg">
          Pts
        </th>
      </tr>
    </thead>
  );
};
