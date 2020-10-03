const db = require('../lib/db.js');
const models = require('../models');
const {Op} = require("sequelize");


/**
 * gets a list of companies
 * @returns {Promise<Company[]>}
 */
const index = async (queryString) => {
  const query = {limit: 20};

  if (queryString) {
    query.where = {
      [Op.or]: [
        {
          name:
            {
              [Op.iLike]: `%${queryString}%`
            }
        },
        {
          ticker: {
            [Op.iLike]: `%${queryString}%`
          }
        }
      ]
    };
  }

  return models.Company.findAll(query);
};


/**
 * gets total contributions by party for a given date range
 *
 * @param tickers - array of ticker symbols (can be just one 😉)
 * @param startDate
 * @param endDate
 * @returns {Promise<*>}
 */
const partyTotalsQuery = async (tickers, startDate, endDate) => {
  const [startYear, endYear] = [startDate, endDate].map(date => (date instanceof Date) ? date.getUTCFullYear() : date);
  const tickersParam = tickers.map(function (a) {
    return "'" + a + "'";
  }).join(",");

  const query = `
    WITH company_sums AS (
      SELECT fcpt.party_affiliation,
             sum(fcpt.total_transactions) AS total_contributed
      FROM companies c
             JOIN fec_company_party_totals fcpt ON c.ticker = fcpt.employer_ticker
      WHERE year BETWEEN $1 AND $2
        AND c.ticker IN (${tickersParam})
      GROUP BY 1
    )
    SELECT coalesce(sum(total_contributed::integer) FILTER (WHERE party_affiliation = 'DEM'), 0)               AS dem_contributions_total,
           coalesce(sum(total_contributed::integer) FILTER (WHERE party_affiliation = 'REP')  , 0)              AS rep_contributions_total,
           coalesce(sum(total_contributed::integer) FILTER (WHERE party_affiliation NOT IN ('DEM', 'REP')), 0)  AS other_contributions_total
    FROM company_sums;
  `;

  return db.query(query, [startYear, endYear]);
};

/**
 *
 * @param tickers
 * @param startDate
 * @param endDate
 * @returns {Promise<{REP: {periodTotal: number, percent: number}, DEM: {periodTotal: number, percent: number}, Other: {periodTotal: number, percent: number}}>}
 */
const contributionsByParty = async (tickers, startDate, endDate) => {
  const partyTotalsResult = await partyTotalsQuery(tickers, startDate, endDate);
  const totalContributions = sumContributions(partyTotalsResult);
  let rollups = {
    DEM: {percent: 0, periodTotal: 0},
    REP: {percent: 0, periodTotal: 0},
    Other: {percent: 0, periodTotal: 0}
  };

  rollups.DEM.periodTotal = partyTotalsResult.rows
    .map(row => Number(row.dem_contributions_total))
    .reduce(sumReducer, 0);

  rollups.REP.periodTotal = partyTotalsResult.rows
    .map(row => Number(row.rep_contributions_total))
    .reduce(sumReducer, 0);

  rollups.Other.periodTotal = partyTotalsResult.rows
    .map(row => Number(row.other_contributions_total))
    .reduce(sumReducer, 0);


  for (const party in rollups) {
    const periodTotal = parseInt(rollups[party].periodTotal, 10);
    rollups[party].percent = percentOfTotal(totalContributions, periodTotal);
  }

  return rollups;
};

/**
 *
 * @param total
 * @param party_total
 * @returns {number}
 */
const percentOfTotal = (total, party_total) => party_total > 0 ? (party_total / total) : 0;

/**
 * sums up total contribution amount from a set broken out by party
 * @param partyTotals
 * @returns {number}
 */
const sumContributions = (partyTotals) => {
  return partyTotals.rows.map(row => {
    return Number(row.dem_contributions_total) + Number(row.rep_contributions_total) + Number(row.other_contributions_total);
  }).reduce(sumReducer, 0);
};

const sumReducer = (accumulator, currentValue) => accumulator + currentValue;


module.exports = {contributionsByParty, index};
