const models = require('../models');
const {Op} = require("sequelize");

/**
 * gets a list of companies filtered by screening criteria
 * @returns {Promise<Company[]>}
 */
const index = async (criteria) => {
  const results = await models.ScreenerAttribute.findAll({
    where: criteria,
    order: [['company_name', 'ASC']]
  });

  return results;
};

/**
 * gets a list of company ids & attributes
 * @returns {Promise<Attributes[]>}
 */
const getByCompanyIds = async (companyIds, attributes) => {
  const results = await models.ScreenerAttribute.findAll({
    attributes: attributes,
    where: {
      company_id: companyIds
    }
  });

  return results;
}

const employeeContributionRanges = (group) => {
  //  hard coded range for now, ideally this is data-driven
  switch (group) {
    case 'small':
      return {[Op.lt]: 2000000};
    case 'medium':
      return {[Op.gte]: 2000000, [Op.lte]: 25000000};
    case 'large':
      return {[Op.gt]: 25000000};
    default:
      return null;
  }
};

const employeeContributionCountRanges = (group) => {
  //  hard coded range for now, ideally this is data-driven
  switch (group) {
    case 'few':
      return {[Op.lt]: 15};
    case 'moderate':
      return {[Op.lt]: 30};
    default:
      return null;
  }
};

const envViolationRanges = (group) => {
  switch (group) {
    case 'few':
      return {[Op.lte]: 0.33};
    case 'moderate':
      return {
        [Op.or]: {
          [Op.lt]: 0.66,
          [Op.gt]: 0.34
        }
      };
    default:
      return null;
  }
};

const genderDiversityRanges = (group) => {
  switch (group) {
    case '0-20%':
      return {[Op.gte]: 0, [Op.lte]: 20};
    case '21-40%':
      return {[Op.gte]: 21, [Op.lte]: 40};
    case '41-60%':
      return {[Op.gte]: 41, [Op.lte]: 60};
    default:
      return null;
  }
};

const paramToColumnMap = {
  'employee_contributions_12_year': 'employee_contributions_12_year',
  'employee_balanced_contributions_count': 'employee_balanced_contributions_count',
  'tilt': 'political_tilt',
  'env_air': 'caa_last_penalty_amt_cdf',
  'env_water': 'caa_last_penalty_amt_cdf',
  'gd_board_directors': 'pct_women_board',
  'gd_executive_level': 'pct_female_exec',
  'gd_senior_mgt_level': 'pct_women_senior_mgt',
  'gd_workforce': 'pct_women_emplys',
  'gd_living_wage': 'living_wage_policy',
  'eq_pay_pub': 'eq_pay_pub',
  'eq_pay_pub3': 'eq_pay_pub3',
  'eq_pay_strat': 'eq_pay_strat',
  'eq_pay_gap': 'eq_pay_gap',
  'eq_pay_gap3': 'eq_pay_gap3',
  'sector_id': 'sector_id',
  'industry_id': 'industry_id'
  // 'env_hazmat': 'caa_last_penalty_amt_cdf',
};

const tiltMap = {
  'REP': 'REP',
  'DEM': 'DEM',
  'UNAFFILIATED': 'unaffiliated'
};

const diversityValues = [
  'eq_pay_pub',
  'eq_pay_pub3',
  'eq_pay_strat',
  'eq_pay_gap',
  'eq_pay_gap3'
];

const diversityRanges = [
  "gd_board_directors",
  "gd_executive_level",
  "gd_senior_mgt_level",
  "gd_workforce",
];

const environmentalRanges = [
  'env_air',
  'env_water'
];

module.exports = {
  index,
  getByCompanyIds,
  employeeContributionRanges,
  employeeContributionCountRanges,
  envViolationRanges,
  genderDiversityRanges,
  environmentalRanges,
  diversityRanges,
  diversityValues,
  paramToColumnMap,
  tiltMap
};
