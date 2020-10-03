const companies = require('../contexts/companies');

/**
 * handler for /api/companies
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const index = async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  try {
    const result = await companies.index(req.query.q);
    res.send({data: result});

  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  index
};
