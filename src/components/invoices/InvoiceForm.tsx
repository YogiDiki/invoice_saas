import { useEffect } from 'react';
import {
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Invoice, InvoicePayload } from '../../types/invoice';

const generateItemId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

const defaultItem = {
  id: generateItemId(),
  description: '',
  quantity: 1,
  price: 0,
};

const defaultValues: InvoicePayload = {
  userId: '',
  invoiceNumber: '',
  companyName: '',
  companyAddress: '',
  clientName: '',
  clientEmail: '',
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date().toISOString().slice(0, 10),
  items: [defaultItem],
  notes: '',
  logoUrl: '',
  total: 0,
};

type InvoiceFormProps = {
  userId: string;
  initialValues?: Invoice | null;
  submitting: boolean;
  onSubmit: (payload: InvoicePayload) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancelEdit?: () => void;
  onUploadLogo: (file: File) => Promise<string>;
};

const InvoiceForm = ({
  userId,
  initialValues,
  submitting,
  onSubmit,
  onDelete,
  onCancelEdit,
  onUploadLogo,
}: InvoiceFormProps) => {
  const form = useForm<InvoicePayload>({
    defaultValues: { ...defaultValues, userId },
  });

  const { control, register, handleSubmit, reset, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({ ...defaultValues, userId });
    }
  }, [initialValues, reset, userId]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const items = watch('items');

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0,
    );
    setValue('total', total);
  }, [items, setValue]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await onUploadLogo(file);
    setValue('logoUrl', url);
  };

  const submitHandler = handleSubmit(async values => {
    await onSubmit({ ...values, userId });
    if (!initialValues) {
      reset({ ...defaultValues, userId });
    }
  });

  return (
    <form
      onSubmit={submitHandler}
      className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {initialValues ? 'Edit Invoice' : 'Buat Invoice Baru'}
          </h3>
          <p className="text-sm text-gray-500">
            Isi detail invoice dan simpan ke Firestore.
          </p>
        </div>
        {initialValues && (
          <div className="flex gap-2">
            {onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Batalkan
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                Hapus
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Nomor Invoice
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="INV-001"
            {...register('invoiceNumber', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Logo Perusahaan
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
          {watch('logoUrl') && (
            <p className="mt-1 text-xs text-green-600">Logo tersimpan.</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Nama Perusahaan
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="PT Contoh"
            {...register('companyName', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Alamat Perusahaan
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Jl. Mawar No.1"
            {...register('companyAddress', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Nama Klien
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="Nama Klien"
            {...register('clientName', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Klien
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            placeholder="client@example.com"
            {...register('clientEmail', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Tanggal Terbit
          </label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            {...register('issueDate', { required: true })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Tanggal Jatuh Tempo
          </label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            {...register('dueDate', { required: true })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Item</p>
          <button
            type="button"
            onClick={() => append({ ...defaultItem, id: generateItemId() })}
            className="text-sm font-semibold text-gray-900"
          >
            + Tambah Item
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-xl border px-4 py-3 md:grid-cols-4"
            >
              <div className="md:col-span-2">
                <input
                  placeholder="Deskripsi"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                  {...register(`items.${index}.description`, { required: true })}
                />
              </div>
              <div>
                <input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                    required: true,
                    min: 1,
                  })}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Harga"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
                  {...register(`items.${index}.price`, {
                    valueAsNumber: true,
                    required: true,
                    min: 0,
                  })}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-red-500"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Catatan</label>
        <textarea
          rows={3}
          className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
          placeholder="Terima kasih atas kerja samanya."
          {...register('notes')}
        />
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold">
            Rp{' '}
            {watch('total').toLocaleString('id-ID', {
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;

