import { useHouseholdStore } from '../../stores/householdStore';
import { useEarnerSelectionStore, type Category } from '../../stores/earnerSelectionStore';
import { ANIMAL_ICONS, CATEGORY_ICONS } from '../shared/Icons';

const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'savings', label: 'Savings' },
  { key: 'retirement', label: 'Retirement' },
  { key: 'tax', label: 'Tax' },
];

export default function EarnerSidebar() {
  const earners = useHouseholdStore((s) => s.earners);
  const selectedEarnerId = useEarnerSelectionStore((s) => s.selectedEarnerId);
  const setSelectedEarnerId = useEarnerSelectionStore((s) => s.setSelectedEarnerId);
  const selectedCategory = useEarnerSelectionStore((s) => s.selectedCategory);
  const setSelectedCategory = useEarnerSelectionStore((s) => s.setSelectedCategory);

  return (
    <aside className="w-16 shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-2">
      {/* Earner icons (only when 2+ earners) */}
      {earners.length > 1 && (
        <>
          {earners.map((earner, i) => {
            const isSelected = selectedEarnerId === earner.id;
            const AnimalIcon = earner.avatarIcon ? ANIMAL_ICONS[earner.avatarIcon] : null;
            const color = COLORS[i % COLORS.length];

            return (
              <button
                key={earner.id}
                onClick={() => setSelectedEarnerId(earner.id)}
                title={earner.name}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  AnimalIcon ? 'bg-gray-100' : `${color} text-sm font-bold text-white`
                } ${
                  isSelected
                    ? 'ring-2 ring-blue-600 ring-offset-2 scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                {AnimalIcon ? (
                  <AnimalIcon width={28} height={28} />
                ) : (
                  earner.name.charAt(0).toUpperCase()
                )}
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

          {/* Divider between earners and categories */}
          <div className="w-10 my-1 border-t-2 border-gray-200" />
        </>
      )}

      {/* Category buttons */}
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.key;
        const CatIcon = CATEGORY_ICONS[cat.key];
        return (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            title={cat.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500 scale-110'
                : 'bg-gray-50 text-gray-400 opacity-50 hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 hover:scale-105'
            }`}
          >
            {CatIcon && <CatIcon width={18} height={18} />}
          </button>
        );
      })}
    </aside>
  );
}
