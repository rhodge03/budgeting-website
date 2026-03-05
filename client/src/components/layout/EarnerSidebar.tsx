import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { useEarnerSelectionStore } from '../../stores/earnerSelectionStore';

export default function EarnerSidebar() {
  const earners = useHouseholdStore((s) => s.earners);
  const selectedEarnerId = useEarnerSelectionStore((s) => s.selectedEarnerId);
  const setSelectedEarnerId = useEarnerSelectionStore((s) => s.setSelectedEarnerId);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (earners.length <= 1) return null;

  const buttons = [
    ...earners.map((e) => ({ id: e.id, label: e.name, isPrimary: e.isPrimary })),
    { id: 'all' as const, label: 'Both Combined', isPrimary: false },
  ];

  return (
    <>
      {/* Mobile toggle — below lg */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="lg:hidden fixed bottom-4 left-4 z-40 bg-blue-600 text-white
                   rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle earner selection"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-48 bg-white border-r border-gray-200 py-4 px-3
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:block shrink-0
        `}
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          View Earner
        </h3>
        <nav className="space-y-1">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setSelectedEarnerId(btn.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedEarnerId === btn.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {btn.label}
              {btn.isPrimary && (
                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
