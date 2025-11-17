import { NavLink } from 'react-router-dom';
import { useAdminAccess } from '../../hooks/useAdminAccess';

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/pricing', label: 'Pricing' },
];

const Sidebar = () => {
  const { isAdmin } = useAdminAccess();
  const navItems = isAdmin
    ? [...baseNavItems, { to: '/admin', label: 'Admin Panel' }]
    : baseNavItems;

  return (
    <aside className="hidden w-64 border-r bg-white lg:block">
      <div className="px-6 py-6">
        <nav className="space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

