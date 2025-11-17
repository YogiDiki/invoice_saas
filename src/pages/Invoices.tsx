import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import InvoiceForm from '../components/invoices/InvoiceForm';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoicePreview from '../components/invoices/InvoicePreview';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import {
  createInvoice,
  deleteInvoice,
  fetchInvoicesByUser,
  updateInvoice,
  uploadCompanyLogo,
} from '../services/invoiceService';
import { Invoice, InvoicePayload } from '../types/invoice';

const Invoices = () => {
  const { user } = useAuth();
  const { plan, limit, status: subscriptionStatus, loading: subscriptionLoading } =
    useSubscription();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const loadInvoices = useCallback(async () => {
    if (!user?.uid) {
      setInvoices([]);
      setLoading(false);
      return [];
    }
    setLoading(true);
    const data = await fetchInvoicesByUser(user.uid);
    setInvoices(data);
    setLoading(false);
    return data;
  }, [user]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleSubmit = async (payload: InvoicePayload) => {
    if (!user?.uid) return;
    if (subscriptionLoading) return;
    if (subscriptionStatus === 'pending') {
      window.alert(
        'Pembayaran Anda masih diverifikasi. Tunggu hingga status aktif untuk membuat invoice.',
      );
      return;
    }
    if (subscriptionStatus !== 'active' && plan === 'free' && invoices.length >= limit) {
      window.alert(
        'Limit invoice paket Free (5 invoice) tercapai. Upgrade via halaman Pricing.',
      );
      return;
    }
    setSaving(true);
    if (activeInvoice) {
      await updateInvoice(activeInvoice.id, payload);
    } else {
      await createInvoice(payload);
    }
    const latestList = await loadInvoices();
    setSaving(false);
    if (activeInvoice) {
      const updated = latestList.find(inv => inv.id === activeInvoice.id);
      setActiveInvoice(updated ?? null);
    } else {
      setActiveInvoice(latestList[0] ?? null);
    }
  };

  const handleDelete = async () => {
    if (!activeInvoice) return;
    await deleteInvoice(activeInvoice.id);
    setActiveInvoice(null);
    await loadInvoices();
  };

  const handleUploadLogo = async (file: File) => {
    if (!user?.uid) throw new Error('User belum siap');
    return uploadCompanyLogo(file, user.uid);
  };

  const handleSelect = (invoice: Invoice) => {
    setActiveInvoice(invoice);
  };

  const handleCancelEdit = () => {
    setActiveInvoice(null);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InvoiceForm
            userId={user?.uid ?? ''}
            initialValues={activeInvoice}
            submitting={saving}
            onSubmit={handleSubmit}
            onDelete={activeInvoice ? handleDelete : undefined}
            onCancelEdit={activeInvoice ? handleCancelEdit : undefined}
            onUploadLogo={handleUploadLogo}
          />
        </div>
        <div className="space-y-6">
          <InvoiceList
            invoices={invoices}
            loading={loading}
            onSelect={handleSelect}
          />
          <InvoicePreview invoice={activeInvoice} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;

