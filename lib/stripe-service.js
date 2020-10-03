const stripeApiKey = process.env.STRIPE_API_KEY;
const stripe = require('stripe')(stripeApiKey);

const attachPaymentMethod = (customerId, paymentMethodId) => {
  return stripe.paymentMethods.attach(paymentMethodId,{customer: customerId});
};

const updateCustomer = (id, paymentMethodId, attrs) => {
  const params = Object.assign(attrs, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  });

  return stripe.customers.update(id, params);
};

const getSubscription = (subscriptionId) => stripe.subscriptions.retrieve(subscriptionId);

const createSubscription = (customerId, planId) => {
  return stripe.subscriptions.create(
    {
      customer: customerId,
      items: [{
        plan: planId
      }],
      expand: ['latest_invoice.payment_intent'],
    });
};

const updateSubscription = (subscription, planId) => {
  return stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: false,
    items: [{
      id: subscription.items.data[0].id,
      plan: planId,
    }]
  });
};

module.exports = {
  attachPaymentMethod,
  updateCustomer,
  createSubscription,
  getSubscription,
  updateSubscription
};