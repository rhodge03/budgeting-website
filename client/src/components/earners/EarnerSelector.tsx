import { useHouseholdStore } from '../../stores/householdStore';

export default function EarnerSelector() {
  const { earners, selectedEarnerId, selectEarner } = useHouseholdStore();

  if (earners.length <= 1) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {earners.map((earner) => (
        <button
          key={earner.id}
          onClick={() => selectEarner(earner.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            earner.id === selectedEarnerId
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {earner.name}
          {earner.isPrimary && (
            <span className="ml-1 text-xs opacity-75">(Primary)</span>
          )}
        </button>
      ))}
    </div>
  );
}
