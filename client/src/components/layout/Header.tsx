import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#003262' }}>
      <h1 className="text-lg font-semibold text-white">
        When Do I Quit?
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{user?.email}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-300 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
