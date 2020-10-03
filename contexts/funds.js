const db = require('../lib/db.js');
const moment = require('moment/moment');
const models = require('../models');
const elections = require('../contexts/elections');
const companies = require('./companies');


/**
 * gets an individual fund
 *
 * @param ticker
 * @returns {Promise<EtfFund>}
 */
const get = async (ticker) => {
  return models.EtfFund.findOne({where: {ticker: ticker}});
};

/**
 * gets most recent date of constituent data for a given fund
 *
 * @param fund_id
 * @returns {Promise<number|undefined>}
 */
const latestConstituentsDate = async (fund_id) => {
  const query = `
      SELECT max(date)
      FROM etf_constituents
      WHERE fund_id = $1
  `;
  const result = await db.query(query, [fund_id]);
  return result.rows[0] && result.rows[0].max;
};

/**
 * gets ticker symbols most recently in a given fund
 *
 * @param fund_id
 * @returns {Promise<*[]|*>}
 */
const constituentTickers = async (fund_id) => {
  const asOfDate = await latestConstituentsDate(fund_id);

  if (asOfDate === undefined) {
    return [];
  }
  const formattedDate = moment(asOfDate).format("YYYY-MM-DD");

  const query = `
    SELECT DISTINCT ec.ticker 
    FROM etf_constituents ec 
    JOIN companies c ON ec.ticker = c.ticker
    WHERE ec.fund_id = ${fund_id} AND ec.date = '${formattedDate}'::date;
  `;
  const constituentTickersQuery = await db.query(query)

  return constituentTickersQuery.rows.map(row => row.ticker)
};

/**
 * gets a sum of contributions across all employees at all constituent companies within a fund
 *
 * @param fund_id
 * @param startDate
 * @param endDate
 * @returns {Promise<undefined|*>}
 */
const employeeContributionsTotal = async (fund_id, startDate, endDate) => {
  // this might be too slow... 😢
  const companySymbolsResult = await constituentTickers(fund_id);

  if (companySymbolsResult.length < 1) {
    return undefined;
  }

  const companySymbolsParam = companySymbolsResult.map(function (a) {
    return "'" + a + "'";
  }).join(",");
  const startDateParam = moment(startDate).format('YYYY-MM-DD');
  const endDateParam = moment(endDate).format('YYYY-MM-DD');

  const employeeContributionsQuery = `
      SELECT sum(transaction_amount)
      FROM fec_contributions_by_individuals
      WHERE employer_ticker IN (${companySymbolsParam})
        AND transaction_date BETWEEN '${startDateParam}'::date AND '${endDateParam}'::date
  `;

  return await db.query(employeeContributionsQuery);
};

const holdingsCount = async (fund) => {
  const asOfDate = await latestConstituentsDate(fund.id);
  return models.EtfConstituent.count({where: {fund_id: fund.id, date: asOfDate}});
};

/**
 * gets a list of constituents including political contribution amounts
 *
 * @param fund
 * @returns {Promise<unknown[]>}
 */
const holdingsWithContributions = async (fund) => {
  const holdingsQuery = `
      SELECT ec.ticker, ec.name, ec.weight
      FROM etf_constituents ec
               JOIN companies c ON ec.ticker = c.ticker
      WHERE ec.fund_id = $1
        AND ec.date = (
          SELECT max(date)
          FROM etf_constituents
          WHERE fund_id = $1
      )
      GROUP BY ec.ticker, ec.name, ec.weight
      ORDER BY ec.weight DESC
      LIMIT 10;
  `;

  const holdings = await db.query(holdingsQuery, [fund.id]);

  const allTheThings = await Promise.all(
    holdings.rows.map(h => addContributionsToHolding(h, elections.currentCycleStart(), elections.currentCycleEnd()))
  );

  return allTheThings;
};

/**
 * gets a tally of employees across all constituents who made contributions
 *
 * @param fund_id
 * @param startDate
 * @param endDate
 * @returns {Promise<*>}
 */
// const contributingEmployeeCountQuery = async (fund_id, startDate, endDate) => {
//   const [startDateString, endDateString] = [startDate, endDate].map(date => moment(date).format("YYYY-MM-DD"));
//
//   const contributingEmployeeCountQuery = `
//     SELECT count(distinct ic.name_clean)
//     FROM fec_contributions_by_individuals ic
//     JOIN etf_constituents ec ON ic.employer_ticker = ec.ticker
//     WHERE ec.fund_id = $1
//         AND ic.transaction_date >= $2::date
//         AND ic.transaction_date < $3::date;
//   `;
//
//   return await db.query(contributingEmployeeCountQuery, [fund_id, startDateString, endDateString]);
// };

/**
 * gets tally of fund constituents for which there is FEC coverage
 *
 * @param fund_id
 * @param dates
 * @returns {Promise<*>}
 */
const coveredHoldingsCountQuery = async (fund_id, dates) => {
  const [startYear, endYear] = dates.map(date => date.getUTCFullYear());
  const query = `
      SELECT count(distinct c.ticker)
      FROM etf_constituents ec
               JOIN companies c ON ec.ticker = c.ticker
               JOIN fec_company_party_totals fcpt ON ec.ticker = fcpt.employer_ticker
      WHERE ec.fund_id = $1
        AND fcpt.year >= $2
        AND fcpt.year < $3
        AND ec.date = (
          SELECT max(date)
          FROM etf_constituents
          WHERE fund_id = $1
      )
  `;

  return await db.query(query, [fund_id, startYear, endYear]);
};

/**
 * gets high level statistics for a fund
 *
 * @param fund
 * @param dates
 * @returns {Promise<{totalContributions: number, coveredHoldingsCount: number}>}
 */
const stats = async (fund, dates) => {
  const coveredHoldingsCountResult = await coveredHoldingsCountQuery(fund.id, dates);
  const coveredHoldingsCount = coveredHoldingsCountResult.rows[0] && coveredHoldingsCountResult.rows[0].count || 0;

  const holdingsTotal = await holdingsCount(fund);

  const contributionsResult = await employeeContributionsTotal(fund.id, dates[0], dates[1]);
  const totalContributions = contributionsResult && contributionsResult.rows[0] && contributionsResult.rows[0].sum || 0;

  // too slow - an individual contributors table is probably the answer here
  // const contributingEmployeeCountResult = await contributingEmployeeCountQuery(fund.id, dates[0], dates[1]);
  // const contributingEmployeeCount = contributingEmployeeCountResult && contributingEmployeeCountResult.rows[0] && contributingEmployeeCountResult.rows[0].count || 0;

  const tickers = await constituentTickers(fund.id);
  const contributionsByParty = await companies.contributionsByParty(tickers, dates[0], dates[1]);

  return {
    // contributingEmployeeCount: parseInt(contributingEmployeeCount, 10),
    holdingsCount: parseInt(holdingsTotal, 10),
    coveredHoldingsCount: parseInt(coveredHoldingsCount, 10),
    coveredHoldingsPercent: parseInt(coveredHoldingsCount, 10) / parseInt(holdingsTotal, 10),
    totalContributions: parseInt(totalContributions, 10),
    DEM: contributionsByParty.DEM,
    REP: contributionsByParty.REP,
    Other: contributionsByParty.Other,
  };
};

/**
 * tacks on contributions by party to each holding
 * @param holding
 * @param startDate
 * @param endDate
 * @returns {Promise<{contributions: {REP: {percent: number}, DEM: {percent: number}, Other: {percent: number}}}>}
 */
const addContributionsToHolding = async (holding, startDate, endDate) => {
  const contributionsByParty = await companies.contributionsByParty([holding.ticker], startDate, endDate);
  return {...holding, contributions: contributionsByParty};
};


module.exports = {
  employeeContributionsTotal,
  get,
  holdingsWithContributions,
  stats
};
