import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <p className="text-lg font-semibold">Invoice SaaS</p>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <span className="text-gray-500">Authenticated</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

