export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  userId: string;
  invoiceNumber: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  logoUrl?: string;
  notes?: string;
  items: InvoiceItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoicePayload = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;

