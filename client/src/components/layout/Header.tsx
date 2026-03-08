import { NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const tabs = [
  { to: '/income-retirement', label: 'Income & Retirement' },
  { to: '/budgeting', label: 'Budgeting' },
  { to: '/projections', label: 'Projections' },
];

export default function Header() {
  const { user, isGuest, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 px-4 flex items-center justify-between h-12" style={{ backgroundColor: '#003262' }}>
      {/* Brand */}
      <h1 className="text-base font-semibold text-white whitespace-nowrap">
        When Do I Quit?
      </h1>

      {/* Desktop tabs */}
      <nav className="hidden sm:flex items-center gap-1 h-full">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-3 h-full flex items-center text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-white text-white'
                  : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile pill tabs */}
      <nav className="flex sm:hidden bg-white/10 rounded-full p-0.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                isActive
                  ? 'bg-white text-[#003262]'
                  : 'text-blue-200 hover:text-white'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Auth */}
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
