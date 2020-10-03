const models = require('../models');

/**
 * gets a list of subsidiaries for a given company
 * @returns {Promise<Subsidiaries[]>}
 */
const index = async (parentTicker) => {
  return models.Subsidiary.findAll({where: {parent_ticker: parentTicker}});
};

/**
 * creates a new subsidiary
 * @param params
 * @returns {Promise<params>}
 */
const create = async (params) => {
  params["cleaned_name"] = cleanName(params["name"]);
  return models.Subsidiary.create(params);
};

const cleanName = (val) => val.toUpperCase().replace(/[^a-zA-Z0-9 -]/g, '');

module.exports = {
  index,
  create
};