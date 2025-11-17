import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="min-h-screen bg-gray-100">
    <Navbar />
    <div className="mx-auto flex max-w-7xl">
      <Sidebar />
      <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;

