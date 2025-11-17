import { useRef } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Invoice } from '../../types/invoice';
import { downloadInvoicePDF } from '../../utils/pdf';

type InvoicePreviewProps = {
  invoice?: Invoice | null;
};

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  if (!invoice) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500 shadow-sm">
        Pilih invoice untuk melihat preview dan mengunduh PDF.
      </div>
    );
  }

  const handleDownload = async () => {
    if (!previewRef.current) return;
    await downloadInvoicePDF(previewRef.current, invoice.invoiceNumber);
  };

  return (
    <div className="space-y-4">
      <div
        ref={previewRef}
        className="rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{invoice.companyName}</h2>
            <p className="text-sm text-gray-500">{invoice.companyAddress}</p>
          </div>
          {invoice.logoUrl && (
            <img
              src={invoice.logoUrl}
              alt="Logo perusahaan"
              className="h-14 w-14 rounded object-cover"
            />
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Invoice untuk
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {invoice.clientName}
            </p>
            <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Nomor
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {invoice.invoiceNumber}
            </p>
            <p className="text-xs text-gray-500">
              Terbit:{' '}
              {format(new Date(invoice.issueDate), 'dd MMM yyyy', {
                locale: localeId,
              })}
            </p>
            <p className="text-xs text-gray-500">
              Due:{' '}
              {format(new Date(invoice.dueDate), 'dd MMM yyyy', {
                locale: localeId,
              })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-4 gap-4 border-b pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <p className="col-span-2">Deskripsi</p>
            <p>Qty</p>
            <p className="text-right">Subtotal</p>
          </div>
          <div className="divide-y">
            {invoice.items.map(item => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-4 py-3 text-sm text-gray-700"
              >
                <p className="col-span-2">{item.description}</p>
                <p>{item.quantity}</p>
                <p className="text-right">
                  Rp{' '}
                  {(item.quantity * item.price).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Catatan
            </p>
            <p className="text-sm text-gray-600">
              {invoice.notes || '-'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Total
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              Rp{' '}
              {invoice.total.toLocaleString('id-ID', {
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full rounded-2xl border border-gray-900 bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Download PDF
      </button>
    </div>
  );
};

export default InvoicePreview;

