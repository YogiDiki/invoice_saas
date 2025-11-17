import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import {
  Invoice,
  InvoicePayload,
} from '../types/invoice';

const collectionRef = collection(db, 'invoices');

const randomName = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const mapInvoice = (snapshot: QueryDocumentSnapshot<DocumentData>) => {
  const data = snapshot.data() as InvoicePayload & {
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString() ?? new Date().toISOString(),
  } as Invoice;
};

export const fetchInvoicesByUser = async (userId: string) => {
  const q = query(
    collectionRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapInvoice);
};

export const createInvoice = async (payload: InvoicePayload) => {
  const docRef = await addDoc(collectionRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateInvoice = async (
  invoiceId: string,
  payload: Partial<InvoicePayload>,
) => {
  const refDoc = doc(collectionRef, invoiceId);
  await updateDoc(refDoc, { ...payload, updatedAt: serverTimestamp() });
};

export const deleteInvoice = async (invoiceId: string) => {
  const refDoc = doc(collectionRef, invoiceId);
  await deleteDoc(refDoc);
};

export const uploadCompanyLogo = async (file: File, userId: string) => {
  const fileRef = ref(storage, `logos/${userId}/${randomName()}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

