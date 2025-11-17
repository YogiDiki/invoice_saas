import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  approveManualPayment,
  fetchAdminStats,
  fetchManualPayments,
  rejectManualPayment,
  type ManualPayment,
} from '../services/adminService';
import { planMeta } from '../services/subscriptionService';

const AdminDashboard = () => {
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPayments: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [paymentsData, statsData] = await Promise.all([
      fetchManualPayments(),
      fetchAdminStats(),
    ]);
    setPayments(paymentsData);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (payment: ManualPayment) => {
    setProcessingId(payment.id);
    await approveManualPayment(payment);
    await loadData();
    setProcessingId(null);
  };

  const handleReject = async (payment: ManualPayment) => {
    setProcessingId(payment.id);
    await rejectManualPayment(payment);
    await loadData();
    setProcessingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 text-3xl font-semibold">{stats.totalUsers}</p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="mt-2 text-3xl font-semibold">{stats.activeUsers}</p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Payments Pending</p>
            <p className="mt-2 text-3xl font-semibold">
              {stats.pendingPayments}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Manual Payments</h2>
              <p className="text-sm text-gray-500">
                Verifikasi bukti transfer dari user berbayar.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-gray-500">Memuat data...</p>
          ) : payments.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">
              Tidak ada pembayaran manual.
            </p>
          ) : (
            <div className="mt-6 overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Harga</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Bukti</th>
                    <th className="px-3 py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-3 py-3 font-mono text-xs text-gray-600">
                        {payment.uid}
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        {planMeta[payment.plan].label}
                      </td>
                      <td className="px-3 py-3">
                        Rp {payment.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 capitalize">
                        {payment.status}
                      </td>
                      <td className={payment.proofImageUrl ? 'px-3 py-3' : 'px-3 py-3 text-gray-400'}>
                        {payment.proofImageUrl ? (
                          <a
                            href={payment.proofImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-gray-900 underline"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {payment.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleReject(payment)}
                              disabled={processingId === payment.id}
                              className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 disabled:opacity-50"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => handleApprove(payment)}
                              disabled={processingId === payment.id}
                              className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sudah diproses
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

