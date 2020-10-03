const mailer = require("../lib/mailer");

/**
 * sends a generic email to support
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {
  const {
    email,
  } = req.body;

  const message = {
    from: 'support@floodlightinvest.com',
    to: 'support@floodlightinvest.com',
    subject: 'Contact form submission',
    text: `email: ${email}\n\nsubmitted a "Get in touch" contact form. Please contact them!`
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


module.exports = {
  create: create,
};
