import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/income-retirement', label: 'Income & Retirement' },
  { to: '/budgeting', label: 'Budgeting' },
  { to: '/projections', label: 'Projections' },
];

export default function TabBar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[44px] z-10">
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 text-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
