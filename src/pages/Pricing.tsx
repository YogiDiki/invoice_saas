import DashboardLayout from '../components/layout/DashboardLayout';
import PlanCard from '../components/subscription/PlanCard';

const Pricing = () => (
  <DashboardLayout>
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Pilih paket</h2>
        <p className="text-sm text-gray-500">
          Upgrade kapan saja. Pembayaran Basic/Pro diproses manual oleh admin.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <PlanCard plan="free" ctaLabel="Tetap di Free" />
        <PlanCard
          plan="basic"
          ctaLabel="Bayar Manual"
          target="/manual-payment?plan=basic"
        />
        <PlanCard
          plan="pro"
          ctaLabel="Bayar Manual"
          target="/manual-payment?plan=pro"
        />
      </div>
    </section>
  </DashboardLayout>
);

export default Pricing;

