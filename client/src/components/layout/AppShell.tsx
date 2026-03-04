import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
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
      <main className="flex-1 p-4 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
