type PaymentFormProps = {
  planLabel: string;
  price: number;
  proofUrl: string;
  status: 'idle' | 'uploading' | 'submitted';
  onUpload: (file: File) => Promise<void>;
  onSubmit: () => Promise<void>;
};

const PaymentForm = ({
  planLabel,
  price,
  proofUrl,
  status,
  onUpload,
  onSubmit,
}: PaymentFormProps) => {
  const disabled = status === 'uploading' || status === 'submitted';

  return (
    <section className="max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Pembayaran Manual ({planLabel})
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Transfer ke rekening BCA 1234567890 (a.n Invoice SaaS) atau scan QRIS
        berikut lalu unggah bukti pembayaran agar diverifikasi admin.
      </p>

      <dl className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <dt>Nominal</dt>
          <dd className="font-semibold">
            Rp {price.toLocaleString('id-ID')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Status</dt>
          <dd className="font-semibold capitalize">{status}</dd>
        </div>
      </dl>

      <label className="mt-6 block text-sm font-medium text-gray-700">
        Upload Bukti Pembayaran
      </label>
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
        }}
      />

      {proofUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Preview</p>
          <img
            src={proofUrl}
            alt="Bukti pembayaran"
            className="mt-2 h-48 w-full rounded-xl object-cover"
          />
        </div>
      )}

      <button
        type="button"
        disabled={!proofUrl || disabled}
        className="mt-6 w-full rounded-lg bg-gray-900 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onSubmit}
      >
        Kirim Bukti
      </button>
    </section>
  );
};

export default PaymentForm;

