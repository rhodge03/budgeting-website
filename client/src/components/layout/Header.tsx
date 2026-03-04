import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-900">
        Household Financial Planner
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
