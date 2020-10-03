const auth0Service = require("../lib/auth0-service");
const stripeService = require("../lib/stripe-service");
const mailer = require("../lib/mailer");

/**
 * sends an email to support expressing interest in a corporate subscription
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const contact = async (req, res) => {
  const {
    name,
    email,
  } = req.body;

  const message = {
    from: 'support@floodlightinvest.com',
    to: 'support@floodlightinvest.com',
    subject: 'Interest in a corporate subscription',
    text: `name: ${name}\nemail: ${email}\n\nsubmitted a contact form to express interest in a corporate plan. Please contact them!`
  };

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  try {
    await mailer.sendMail(message);
    console.log("Processed contact form: " + JSON.stringify(message));
    return res.send({"data": {sent: true}});

  } catch (e) {
    console.error(JSON.stringify(e));
    return res.status(500).send({"data": {errors: [e]}});
  }
};

/**
 * updates an existing subscription to a different plan
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const update = async (req, res) => {
  const auth0UserId = auth0Service.userId(req.header('Authorization'));
  const {
    name,
    email,
    phone,
    company,
    customerId,
    paymentMethodId,
    existingSubscriptionId,
    newPlanId
  } = req.body;
  const description = company;
  let updateResponse, errors = [];

  try {
    if (paymentMethodId) {
      console.log(`Attaching payment method for ${customerId}`);
      await stripeService.attachPaymentMethod(customerId, paymentMethodId);
      console.log(`Updating customer ${customerId}`);
      await stripeService.updateCustomer(customerId, paymentMethodId, {name, email, phone, description});
    }

    console.log(`Getting subscription ${existingSubscriptionId}`);
    const subscriptionResponse = await stripeService.getSubscription(existingSubscriptionId);
    console.log(`Update subscription ${existingSubscriptionId} ${JSON.stringify(subscriptionResponse)}`);
    updateResponse = await stripeService.updateSubscription(subscriptionResponse, newPlanId);
    console.log(`Adding subscription data to Auth0 userId ${auth0UserId}`);
    await auth0Service.addSubscriptionData(updateResponse, auth0UserId);

  } catch (err) {
    errors.push(err);
    console.error(JSON.stringify(err));
    return res.status(500).send({"data": {"errors": errors}});
  }

  return res.send({"data": updateResponse});
};


module.exports = {
  contact: contact,
  update: update,
};
