const db = require('../lib/db.js');

let count = 0;

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  const queryTopOverall = `
    select employer_ticker, name, sum(total_transactions) as total from "fec_company_party_totals" as a
    inner join companies as b on a.employer_ticker = b.ticker
    where year between $1 and $2
    Group by employer_ticker, name
    order by total desc
    limit 10
  `;

  const queryTopDem = `
    select employer_ticker, name, party_affiliation, sum(total_transactions) as total from "fec_company_party_totals" as a
    inner join companies as b on a.employer_ticker = b.ticker
    where party_affiliation = 'DEM' and year between $1 and $2
    Group by employer_ticker, name, party_affiliation
    order by total desc
    limit 10;
  `;

  const queryTopRep = `
    select employer_ticker, name, party_affiliation, sum(total_transactions) as total from "fec_company_party_totals" as a
    inner join companies as b on a.employer_ticker = b.ticker
    where party_affiliation = 'REP' and year between $1 and $2
    Group by employer_ticker, name, party_affiliation
    order by total desc
    limit 10;
  `;

  const inputs = [req.params.startYear, req.params.endYear];

  const results = await Promise.all([
    db.query(queryTopOverall, inputs),
    db.query(queryTopDem, inputs),
    db.query(queryTopRep, inputs),
  ]);

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  res.send({
    data: {
      top: results[0].rows,
      topDem: results[1].rows,
      topRep: results[2].rows,
    },
  });

  console.timeEnd(label);
};
