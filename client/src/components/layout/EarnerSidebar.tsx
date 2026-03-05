import { useHouseholdStore } from '../../stores/householdStore';
import { useEarnerSelectionStore } from '../../stores/earnerSelectionStore';

const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

export default function EarnerSidebar() {
  const earners = useHouseholdStore((s) => s.earners);
  const selectedEarnerId = useEarnerSelectionStore((s) => s.selectedEarnerId);
  const setSelectedEarnerId = useEarnerSelectionStore((s) => s.setSelectedEarnerId);

  if (earners.length <= 1) return null;

  return (
    <aside className="w-16 shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-2">
      {earners.map((earner, i) => {
        const isSelected = selectedEarnerId === earner.id;
        const initial = earner.name.charAt(0).toUpperCase();
        const color = COLORS[i % COLORS.length];

        return (
          <button
            key={earner.id}
            onClick={() => setSelectedEarnerId(earner.id)}
            title={earner.name}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all ${color} ${
              isSelected
                ? 'ring-2 ring-blue-600 ring-offset-2 scale-110'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            {initial}
          </button>
        );
      })}

      {/* Divider */}
      <div className="w-6 border-t border-gray-300" />

      {/* Both combined */}
      <button
        onClick={() => setSelectedEarnerId('all')}
        title="Both Combined"
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gray-600 text-white text-xs font-bold ${
          selectedEarnerId === 'all'
            ? 'ring-2 ring-blue-600 ring-offset-2 scale-110'
            : 'opacity-60 hover:opacity-100 hover:scale-105'
        }`}
      >
        All
      </button>
    </aside>
  );
}
