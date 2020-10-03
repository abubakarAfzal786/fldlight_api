const ScreenerAttributes = require('../contexts/screener-attributes');

module.exports = async (req, res) => {
  const {body} = req;
  const criteria = buildCriteria(body);
  try{
    const results = await ScreenerAttributes.index(criteria);
    res.send({
      data: results,
      count: results.length
    });
   }catch(e){
    res.status(500).send(e);
   }
};

/**
 * filters and converts request params to sequelize-compatible criteria
 * @param requestParams
 * @returns {{}}
 */
const buildCriteria = (requestParams) => {
  const allowedParams = Object.keys(ScreenerAttributes.paramToColumnMap);
  const criteria = {};

  allowedParams.forEach((param) => {
    if (!Object.keys(requestParams).includes(param)) {
      return;
    }

    const criteriaKey = ScreenerAttributes.paramToColumnMap[param];

    if (param === 'employee_contributions_12_year') {
      const rangeParam = ScreenerAttributes.employeeContributionRanges(requestParams[param]);

      if (rangeParam) {
        criteria[criteriaKey] = rangeParam;
      }

    } else if (param === 'employee_balanced_contributions_count') {
      const rangeParam = ScreenerAttributes.employeeContributionCountRanges(requestParams[param]);

      if (rangeParam) {
        criteria[criteriaKey] = rangeParam;
      }

    } else if (param === 'tilt') {
      const rangeParam = ScreenerAttributes.tiltMap[requestParams[param]];

      if (rangeParam) {
        criteria[criteriaKey] = rangeParam;
      }
    } else if (ScreenerAttributes.environmentalRanges.includes(param)) {
      const rangeParam = ScreenerAttributes.envViolationRanges(requestParams[param]);

      if (rangeParam) {
        criteria[criteriaKey] = rangeParam;
      }

    } else if (ScreenerAttributes.diversityValues.includes(param)) {

      if (requestParams[param]) {
        criteria[criteriaKey] = requestParams[param];
      }

    } else if (
      ScreenerAttributes.diversityRanges.includes(param)
    ) {
      const rangeParam = ScreenerAttributes.genderDiversityRanges(
        requestParams[param]
      );
      if (rangeParam) {
        criteria[criteriaKey] = rangeParam;
      }
    } else {
      criteria[criteriaKey] = requestParams[param];
    }
  });

  return criteria;
};