import { Outlet } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';

export default function AppShell() {
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
