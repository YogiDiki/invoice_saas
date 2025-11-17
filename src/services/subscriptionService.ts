import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export type Plan = 'free' | 'basic' | 'pro';
export type SubscriptionStatus = 'free' | 'pending' | 'active' | 'expired';
export type UserRole = 'admin' | 'user';
export type ManualPaymentStatus = 'pending' | 'approved' | 'rejected';

export const planMeta: Record<
  Plan,
  {
    price: number;
    limit: number;
    label: string;
    description: string;
  }
> = {
  free: {
    price: 0,
    limit: 5,
    label: 'Free',
    description: 'Cocok untuk mencoba, maksimal 5 invoice.',
  },
  basic: {
    price: 50000,
    limit: 50,
    label: 'Basic',
    description: 'Kirim hingga 50 invoice / bulan.',
  },
  pro: {
    price: 150000,
    limit: Number.POSITIVE_INFINITY,
    label: 'Pro',
    description: 'Unlimited invoice + prioritas support.',
  },
};

const userDoc = (uid: string) => doc(db, 'users', uid);
const paymentsCollection = collection(db, 'manualPayments');

const randomName = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const fetchUserSubscription = async (uid: string) => {
  const snapshot = await getDoc(userDoc(uid));
  if (!snapshot.exists()) {
    return {
      activePlan: 'free' as Plan,
      subscriptionStatus: 'free' as SubscriptionStatus,
      role: 'user' as UserRole,
      limit: planMeta.free.limit,
    };
  }
  const data = snapshot.data() as {
    activePlan?: Plan;
    subscriptionStatus?: SubscriptionStatus;
    expiresAt?: string | null;
    role?: UserRole;
  };

  const role = data.role ?? 'user';
  const plan = data.activePlan ?? 'free';
  const status = data.subscriptionStatus ?? 'free';
  const expiresAt = data.expiresAt ?? null;

  if (expiresAt) {
    const expired = new Date(expiresAt).getTime() < Date.now();
    if (expired && plan !== 'free') {
      await updateUserSubscription(uid, {
        activePlan: 'free',
        subscriptionStatus: 'expired',
        expiresAt: null,
      });
      return {
        activePlan: 'free' as Plan,
        subscriptionStatus: 'expired' as SubscriptionStatus,
        role,
        limit: planMeta.free.limit,
      };
    }
  }

  return {
    activePlan: plan,
    subscriptionStatus: status,
    role,
    expiresAt,
    limit: planMeta[plan].limit,
  };
};

export const updateUserSubscription = async (
  uid: string,
  payload: {
    activePlan?: Plan;
    subscriptionStatus?: SubscriptionStatus;
    expiresAt?: string | null;
    role?: UserRole;
  },
) =>
  setDoc(
    userDoc(uid),
    {
      activePlan: payload.activePlan,
      subscriptionStatus: payload.subscriptionStatus,
      expiresAt: payload.expiresAt ?? null,
      role: payload.role,
    },
    { merge: true },
  );

export const uploadPaymentProof = async (uid: string, file: File) => {
  const path = `payments/${uid}/${randomName()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const createManualPayment = async (payload: {
  uid: string;
  plan: Plan;
  price: number;
  proofImageUrl: string;
}) => {
  await updateUserSubscription(payload.uid, {
    subscriptionStatus: 'pending',
  });

  return addDoc(paymentsCollection, {
    uid: payload.uid,
    plan: payload.plan,
    price: payload.price,
    proofImageUrl: payload.proofImageUrl,
    status: 'pending' as ManualPaymentStatus,
    createdAt: serverTimestamp(),
  });
};

