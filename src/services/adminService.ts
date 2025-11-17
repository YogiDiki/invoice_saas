import {
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  ManualPaymentStatus,
  Plan,
  SubscriptionStatus,
  updateUserSubscription,
} from './subscriptionService';

const manualPaymentsRef = collection(db, 'manualPayments');
const usersRef = collection(db, 'users');

export type ManualPayment = {
  id: string;
  uid: string;
  plan: Plan;
  price: number;
  proofImageUrl: string;
  status: ManualPaymentStatus;
  createdAt: string;
};

export const fetchManualPayments = async () => {
  const q = query(manualPaymentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data() as Omit<ManualPayment, 'id' | 'createdAt'> & {
      createdAt?: Timestamp;
    };
    return {
      id: docSnap.id,
      ...data,
      createdAt:
        data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
    } as ManualPayment;
  });
};

const nextThirtyDaysISO = () => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  return expires.toISOString();
};

export const approveManualPayment = async (payment: ManualPayment) => {
  const paymentDoc = doc(manualPaymentsRef, payment.id);
  await updateDoc(paymentDoc, {
    status: 'approved' as ManualPaymentStatus,
    processedAt: serverTimestamp(),
  });

  await updateUserSubscription(payment.uid, {
    activePlan: payment.plan,
    subscriptionStatus: 'active',
    expiresAt: nextThirtyDaysISO(),
  });
};

export const rejectManualPayment = async (payment: ManualPayment) => {
  const paymentDoc = doc(manualPaymentsRef, payment.id);
  await updateDoc(paymentDoc, {
    status: 'rejected' as ManualPaymentStatus,
    processedAt: serverTimestamp(),
  });
  await updateUserSubscription(payment.uid, {
    activePlan: 'free',
    subscriptionStatus: 'free',
    expiresAt: null,
  });
};

export const fetchAdminStats = async () => {
  const usersSnapshot = await getDocs(usersRef);
  const totalUsers = usersSnapshot.size;
  let activeUsers = 0;
  usersSnapshot.forEach(docSnap => {
    const data = docSnap.data() as { subscriptionStatus?: SubscriptionStatus };
    if (data.subscriptionStatus === 'active') activeUsers += 1;
  });

  const pendingPaymentsSnapshot = await getDocs(
    query(manualPaymentsRef, where('status', '==', 'pending')),
  );

  return {
    totalUsers,
    activeUsers,
    pendingPayments: pendingPaymentsSnapshot.size,
  };
};

