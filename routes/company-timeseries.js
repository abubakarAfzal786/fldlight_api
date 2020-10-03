const _ = require("lodash");
const db = require('../lib/db.js');

let count = 0;

// "/api/company/timeseries/:ticker/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  const query = `
    SELECT
      distinct party_affiliation, year,
      sum(total_transactions) OVER (PARTITION BY employer_ticker,year,party_affiliation) AS party_total,
      sum(total_transactions) OVER (PARTITION BY employer_ticker,year) AS year_total,
      CASE 
        WHEN sum(total_transactions) OVER (PARTITION BY employer_ticker,year) > 0 THEN
          LEAST(sum(total_transactions) OVER (PARTITION BY employer_ticker,year,party_affiliation) / sum(total_transactions) OVER (PARTITION BY employer_ticker,year), 1)
        else
          NULL
      END AS percent_of_total
    FROM
      "fec_company_party_totals"
    WHERE
      employer_ticker = $1
      and year between $2 and $3
    ORDER BY year desc, percent_of_total desc
    `;

  const results = await db.query(
    query,
    [req.params.ticker, req.params.startYear, req.params.endYear],
  );

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  const years = {};
  let maxYear = 0;

  // "employer_ticker" "party_affiliation" "year" "party_total" "year_total" "pct_of_total"
  // "AAPL" "DEM" 2019 229722.16 411730.21 0.55794341639395370090
  // "AAPL" "" 2019 168342.86 411730.21 0.40886691311769422992
  // "AAPL" "DFL" 2019 8580.87 411730.21 0.02084100168408822855
  // "AAPL" "REP" 2019 4834.32 411730.21 0.01174147507903294247
  // "AAPL" "IND" 2019 250.00 411730.21 0.00060719372523089817
  // "AAPL" "DEM" 2018 1694525.43 1806029.77 0.93825996567044407025
  // "AAPL" "REP" 2018 52491.68 1806029.77 0.02906468147532252472
  // "AAPL" "" 2018 27035.30 1806029.77 0.01496946531507063696

  // should all this happen on the server? yes
  results.rows.forEach((row) => {
    // pie
    const year = years[row.year] || {
      label: row.year,
      // force all three to always exist
      DEM: {
        percent: 0, amount: 0,
      },
      REP: {
        percent: 0, amount: 0,
      },
      Other: {
        percent: 0, amount: 0,
      }
    };

    let pty = row.party_affiliation;

    maxYear = Math.max(maxYear, row.year);

    if (pty !== 'REP' && pty !== 'DEM') {
      pty = 'Other';
    }

    year[pty].percent += row.percent_of_total * 1;
    year[pty].amount += row.party_total * 1;

    // needs to be sorted the same way as the first year
    years[row.year] = year;
  });

  var flattened_years = [], item;
   
  _.forEach(years, function(breakout, year) {
      item = {
        year: parseInt(year),
        DEM: breakout.DEM,
        REP: breakout.REP,
        Other: breakout.Other
      };
      flattened_years.push(item);
  });

  flattened_years = flattened_years.sort((a, b) => a.year - b.year);

  res.send(
    flattened_years
  );

  console.timeEnd(label);
};
