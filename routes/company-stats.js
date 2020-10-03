const _ = require('lodash')

const db = require('../lib/db.js');

let count = 0;

//  "/api/company/stats/:ticker/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  const queryEmployees = `
    SELECT
      count(DISTINCT name_clean), EXTRACT(YEAR FROM transaction_date) AS year
    FROM
      fec_contributions_by_individuals
    WHERE
      employer_ticker = $1
      AND EXTRACT(YEAR FROM transaction_date) BETWEEN $2 AND $3
    GROUP BY
      EXTRACT(YEAR FROM transaction_date)
  `;

  const queryTotalEmployees = `
    SELECT
      count(DISTINCT name_clean)
    FROM
      fec_contributions_by_individuals
    WHERE
      employer_ticker = $1
      AND EXTRACT(YEAR FROM transaction_date) BETWEEN $2 AND $3
  `;

  const queryParties = `
          SELECT
            distinct party_affiliation, year,
            sum(total_transactions) OVER (PARTITION BY employer_ticker,party_affiliation,year) AS party_total
          FROM
            "fec_company_party_totals"
          WHERE
            employer_ticker = $1
            and year >= $2 and year <= $3
          ORDER BY year ASC
  `;

  const queryCompany = `
      SELECT c.name, c.sector, c.industry, f.employee_count 
      FROM companies AS c
      LEFT OUTER JOIN fundamentals as f ON (c.ticker = f.ticker)
      WHERE c.ticker = $1
  `;

  const filledRequest = fillRequestParameters(req);

  const inputs = [filledRequest.params.ticker, filledRequest.params.startYear, filledRequest.params.endYear];

  const results = await Promise.all([
    db.query(queryEmployees, inputs),
    db.query(queryParties, inputs),
    db.query(queryCompany, [filledRequest.params.ticker]),
    db.query(queryTotalEmployees, inputs)
  ]);

  let employeeCountByYear = {}
  if (results[0].rows && results[0].rows.length) {
    employeeCountByYear = _.mapValues(_.keyBy(results[0].rows, 'year'), 'count')
  }

  let totalEmployeeContributors;
  if (results[3].rows && results[3].rows.length) {
    totalEmployeeContributors = parseInt(results[3].rows[0].count, 0)
  }

  // console.log(results.rows);

  const company = results[2].rows[0];

  const politicsContributionsByYear = _.groupBy(results[1].rows, 'year');
  
  var politicsYearSummaries = [], item;
   
  _.forEach(politicsContributionsByYear, function(contributions, year) {
      var repTotal = contributions.reduce((total, contribution) => {
        return total + (contribution.party_affiliation === "REP" ? parseInt(contribution.party_total,0) : 0)
      }, 0) || 0;
      var demTotal = contributions.reduce((total, contribution) => {
        return total + (contribution.party_affiliation === "DEM" ? parseInt(contribution.party_total, 0) : 0)
      }, 0) || 0;
      var otherTotal = contributions.reduce((total, contribution) => {
        return total + (["DEM", "REP"].includes(contribution.party_affiliation) === false ? parseInt(contribution.party_total, 0) : 0)
      }, 0) || 0;
      var fullTotal = contributions.reduce((total, contribution) => {
        return total + parseInt(contribution.party_total,0)
      }, 0) || 0;
      item = {
        year: parseInt(year),
        contributingEmployeeCount: parseInt(employeeCountByYear[year] || 0, 0),
        total: fullTotal,
        REP: {percent: repTotal / fullTotal, amount: repTotal },
        DEM: {percent: demTotal / fullTotal, amount: demTotal },
        Other: {percent: otherTotal / fullTotal, amount: otherTotal }
      };
      politicsYearSummaries.push(item);
  });

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  res.send({
    ticker: filledRequest.params.ticker,
    name: company.name,
    sector: company.sector,
    industry: company.industry,
    totalEmployeeCount: company.employee_count,
    politics: {
      contributions: {
        contributingEmployeeCount: totalEmployeeContributors,
        percentageContributingEmployees: company.employee_count == null ? null : (totalEmployeeContributors / company.employee_count * 100),
        total: politicsYearSummaries.reduce((total, summary) => {
          return total + summary.total
        }, 0),
        REP: politicsYearSummaries.reduce((total, summary) => {
          return total + summary.REP.amount
        }, 0),
        DEM: politicsYearSummaries.reduce((total, summary) => {
          return total + summary.DEM.amount
        }, 0),
        Other: politicsYearSummaries.reduce((total, summary) => {
          return total + summary.Other.amount
        }, 0),
        years: politicsYearSummaries
      }
    },
  });

  console.timeEnd(label);
};

function fillRequestParameters(req) {
  const filledRequest = req;

  filledRequest.params.startYear = filledRequest.params.startYear || 0;
  filledRequest.params.endYear = filledRequest.params.endYear || 10000; //Doubt we'll care after 8 millenia
  filledRequest.params.ticker = filledRequest.params.ticker || getCompanyOfTheDayTicker();

  return filledRequest;
};

function getCompanyOfTheDayTicker() {

  //rotate based on day in year
  const companyOfTheDayOptions = ['DIS','F','KO', 'XOM','AXP', 'CVS', 'BA', 'DOW', 'AMZN', 'EXC'];
  const todaysTicker = companyOfTheDayOptions[getDayOfYear() % companyOfTheDayOptions.length];

  return todaysTicker;
};

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};
