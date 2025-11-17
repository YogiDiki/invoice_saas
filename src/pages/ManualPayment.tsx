import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import PaymentForm from '../components/subscription/PaymentForm';
import { useAuth } from '../hooks/useAuth';
import {
  createManualPayment,
  planMeta,
  uploadPaymentProof,
  type Plan,
} from '../services/subscriptionService';

const ManualPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const selectedPlan = (params.get('plan') as Plan) ?? 'basic';

  const [proofUrl, setProofUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitted'>(
    'idle',
  );

  const handleUpload = async (file: File) => {
    if (!user?.uid) return;
    setStatus('uploading');
    const url = await uploadPaymentProof(user.uid, file);
    setProofUrl(url);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (!user?.uid || !proofUrl) return;
    setStatus('submitted');
    await createManualPayment({
      uid: user.uid,
      plan: selectedPlan,
      price: planMeta[selectedPlan].price,
      proofImageUrl: proofUrl,
    });
    navigate('/pricing', { replace: true });
  };

  return (
    <DashboardLayout>
      <PaymentForm
        planLabel={planMeta[selectedPlan].label}
        price={planMeta[selectedPlan].price}
        proofUrl={proofUrl}
        status={status}
        onUpload={handleUpload}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
};

export default ManualPayment;

