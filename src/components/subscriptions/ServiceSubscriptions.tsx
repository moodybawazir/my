import React, { useState, useEffect } from 'react';
import { BillingToggle } from './BillingToggle';
import { PricingCard } from './PricingCard';
import { fetchServiceSubscriptionPlans } from '../../lib/subscriptionQueries';
import { PlanWithPackages } from '../../types/subscription.types';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceSubscriptionsProps {
    serviceId: string;
}

export const ServiceSubscriptions: React.FC<ServiceSubscriptionsProps> = ({ serviceId }) => {
    const [plans, setPlans] = useState<PlanWithPackages[]>([]);
    const [loading, setLoading] = useState(true);
    const [cycle, setCycle] = useState<'monthly' | 'bimonthly' | 'yearly'>('monthly');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPlans() {
            setLoading(true);
            const data = await fetchServiceSubscriptionPlans(serviceId);
            setPlans(data);
            setLoading(false);
        }
        loadPlans();
    }, [serviceId]);

    const handleSubscribe = (planId: string) => {
        navigate(`/checkout?plan=${planId}&cycle=${cycle}`);
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#cfd9cc]" size={32} /></div>;
    }

    if (plans.length === 0) {
        return null; // Don't show anything if no subscriptions
    }

    return (
        <div className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white mb-4">باقات الاشتراك</h2>
                <p className="text-[#cfd9cc]/60 max-w-2xl mx-auto">اختر الباقة المناسبة لاحتياجاتك لضمان تحقيق أفضل النتائج لأعمالك</p>
            </div>

            <BillingToggle cycle={cycle} onChange={setCycle} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map(plan => (
                    <PricingCard key={plan.id} plan={plan} cycle={cycle} onSubscribe={handleSubscribe} />
                ))}
            </div>
        </div>
    );
};
