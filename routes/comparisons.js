const ScreenerAttributes = require('../contexts/screener-attributes');

module.exports = async (req, res) => {
  const companyIds = req.query.companyIds.split(',').map(id => `${id}`)
  let attributes = [
    'company_id',
    'political_tilt',
    'employee_contributions_12_year',
    'employee_balanced_contributions_count',
    'caa_last_penalty_amt_cdf',
    'cwa_last_penalty_amt_cdf'
  ]
  try {
    const results = await ScreenerAttributes.getByCompanyIds(companyIds, attributes);
    res.send(results);
  } catch (e) {
    res.status(500).send(e);
  }
};
