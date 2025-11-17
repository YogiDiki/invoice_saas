import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Invoice } from '../../types/invoice';

type InvoiceListProps = {
  invoices: Invoice[];
  loading: boolean;
  onSelect: (invoice: Invoice) => void;
};

const InvoiceList = ({ invoices, loading, onSelect }: InvoiceListProps) => {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
        Memuat data invoice...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
        Belum ada invoice. Mulai dengan mengisi form di samping.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map(invoice => (
        <button
          key={invoice.id}
          onClick={() => onSelect(invoice)}
          className="w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-gray-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-gray-500">{invoice.clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                Rp{' '}
                {invoice.total.toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-gray-500">
                Jatuh tempo{' '}
                {format(new Date(invoice.dueDate), 'dd MMM yyyy', {
                  locale: localeId,
                })}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default InvoiceList;

