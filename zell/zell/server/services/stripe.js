const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createConnectAccount = async (email) => {
  if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return { id: 'acct_mock123' };
  }
  const account = await stripe.accounts.create({
    type: 'standard',
    email,
  });
  return account;
};

const createAccountLink = async (accountId) => {
  if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return { url: 'http://localhost:5173/dashboard/stripe-success-mock' };
  }
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:5173/dashboard/stripe-refresh',
    return_url: 'http://localhost:5173/dashboard/stripe-success',
    type: 'account_onboarding',
  });
  return accountLink;
};

const createPaymentIntent = async (amount, currency, applicationFeeAmount, stripeAccountId) => {
  if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return { client_secret: 'pi_mock_secret' };
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    application_fee_amount: applicationFeeAmount,
    transfer_data: {
      destination: stripeAccountId,
    },
  });
  return paymentIntent;
};

module.exports = { createConnectAccount, createAccountLink, createPaymentIntent };
