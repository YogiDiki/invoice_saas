import DashboardLayout from '../components/layout/DashboardLayout';

const Dashboard = () => (
  <DashboardLayout>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Selamat datang</h2>
        <p className="mt-2 text-sm text-gray-600">
          Gunakan sidebar untuk mulai membuat dan mengelola invoice.
        </p>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold">Status Sistem</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• Auth Ready</li>
          <li>• Firestore & Storage terhubung</li>
          <li>• PDF Generator siap pakai</li>
        </ul>
      </section>
    </div>
  </DashboardLayout>
);

export default Dashboard;

