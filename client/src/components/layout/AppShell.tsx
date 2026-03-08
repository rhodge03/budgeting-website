import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import GuestBanner from './GuestBanner';
import EarnerSidebar from './EarnerSidebar';
import SkeletonCard from '../shared/SkeletonCard';
import { useHouseholdStore } from '../../stores/householdStore';

export default function AppShell() {
  const loadSnapshot = useHouseholdStore((s) => s.loadSnapshot);
  const isLoading = useHouseholdStore((s) => s.isLoading);
  const location = useLocation();

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <div className="w-16 shrink-0 bg-white border-r border-gray-100" />
        <div className="flex-1 flex flex-col">
          <div className="h-12" style={{ backgroundColor: '#003262' }} />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 space-y-4">
            <SkeletonCard lines={2} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={3} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left earner sidebar — full height */}
      <EarnerSidebar />

      {/* Everything else */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <GuestBanner />
        <Header />

        <div className="flex-1 flex justify-center px-4 min-w-0">
          {/* Main content */}
          <main key={location.pathname} className="flex-1 max-w-5xl w-full py-4 min-w-0 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
