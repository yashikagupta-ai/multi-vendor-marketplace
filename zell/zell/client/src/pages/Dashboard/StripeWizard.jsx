import React from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';

const StripeWizard = () => {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Payout Settings</h2>
        <p>Connect your bank account securely via Stripe to receive payouts.</p>
      </div>

      <Card style={{ maxWidth: '600px', textAlign: 'center', padding: '40px' }}>
        <img src="/images/stripe_payout.png" alt="Stripe Payout" style={{ maxWidth: '280px', width: '100%', marginBottom: '24px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
        <h3 style={{ marginBottom: '16px' }}>Stripe Connect</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Zell partners with Stripe to ensure you get paid quickly and securely. 
          You'll be redirected to Stripe to complete your onboarding profile.
        </p>
        <Button onClick={() => alert('Mock: Redirecting to Stripe OAuth flow...')}>
          Connect with Stripe
        </Button>
      </Card>
    </div>
  );
};

export default StripeWizard;
