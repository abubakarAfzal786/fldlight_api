const models = require('../models');

/**
 * creates a new subsidiary
 * @param params
 * @returns {Promise<params>}
 */
const create = async (params) => {
  return models.CompanyFacility.create(params);
};

const destroy = async (params) => {
  return models.CompanyFacility.delete(params);
};

module.exports = {
  create,
  destroy
};