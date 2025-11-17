import { Link } from 'react-router-dom';
import { planMeta, type Plan } from '../../services/subscriptionService';

type PlanCardProps = {
  plan: Plan;
  ctaLabel: string;
  target?: string;
};

const PlanCard = ({ plan, ctaLabel, target }: PlanCardProps) => {
  const meta = planMeta[plan];
  const isDisabled = plan === 'free' && !target;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-gray-500">{meta.label}</p>
      <p className="mt-2 text-3xl font-bold">
        {meta.price === 0
          ? 'Rp 0'
          : `Rp ${meta.price.toLocaleString('id-ID')}`}
      </p>
      <p className="mt-2 text-sm text-gray-600">{meta.description}</p>
      <p className="mt-1 text-sm text-gray-500">
        Limit:{' '}
        {meta.limit === Number.POSITIVE_INFINITY
          ? 'Unlimited'
          : `${meta.limit} invoice`}
      </p>
      <Link
        to={target ?? '#'}
        className="mt-6 inline-flex w-full justify-center rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
        aria-disabled={isDisabled}
      >
        {ctaLabel}
      </Link>
    </div>
  );
};

export default PlanCard;

