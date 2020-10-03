const stripeApiKey = process.env.STRIPE_API_KEY;
const stripe = require('stripe')(stripeApiKey);

const planDisplayFields = (stripePlan) => {
  return {
    "id": stripePlan.id,
    "product_id": stripePlan.product,
    "interval": stripePlan.interval,
    "amount": stripePlan.amount,
    "amount_decimal": stripePlan.amount_decimal,
    "description": stripePlan.description,
    "name": stripePlan.nickname,
  };
};

module.exports = async (req, res) => {
  try {
    const products = await stripe.plans.list();
    const displayProducts = products.data.map(planDisplayFields);

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    });

    res.send({"data": displayProducts});

  } catch (err) {
    console.log(err);
  }
};
