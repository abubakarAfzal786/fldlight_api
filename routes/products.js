const stripeApiKey = process.env.STRIPE_API_KEY;
const stripe = require('stripe')(stripeApiKey);

const productDisplayFields = (stripeProduct) => {
  return {
    "id": stripeProduct.id,
    "name": stripeProduct.name
  };
};

module.exports = async (req, res) => {
res.set({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
});

  try {
    const products = await stripe.products.list();
    const displayProducts = products.data.map(productDisplayFields);
    res.send({"data": displayProducts});

  } catch (err) {
    console.log(err);
  }
};
