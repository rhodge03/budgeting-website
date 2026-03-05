import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, isGuest, logout } = useAuthStore();

  return (
    <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-10" style={{ backgroundColor: '#003262' }}>
      <h1 className="text-lg font-semibold text-white">
        When Do I Quit?
      </h1>
      <div className="flex items-center gap-4">
        {isGuest ? (
          <>
            <Link to="/signup" className="text-sm text-gray-300 hover:text-white font-medium">
              Sign Up
            </Link>
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-300 hover:text-white"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
