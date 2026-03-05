import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
import AdUnit from '../ads/AdUnit';
import { useHouseholdStore } from '../../stores/householdStore';

export default function AppShell() {
  const loadSnapshot = useHouseholdStore((s) => s.loadSnapshot);
  const isLoading = useHouseholdStore((s) => s.isLoading);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TabBar />

      {/* Banner ad */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-4">
        <AdUnit slot="BANNER_SLOT" format="horizontal" />
      </div>

      <div className="flex-1 flex justify-center px-4">
        {/* Main content */}
        <main className="flex-1 max-w-5xl w-full py-4">
          <Outlet />
        </main>

        {/* Right sidebar ad — large screens only */}
        <aside className="hidden lg:block w-[160px] shrink-0 ml-4 py-4">
          <div className="sticky top-4">
            <AdUnit
              slot="SIDEBAR_SLOT"
              format="vertical"
              responsive={false}
              style={{ width: 160, height: 600 }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
