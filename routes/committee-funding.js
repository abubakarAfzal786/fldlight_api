const db = require('../lib/db.js');

let count = 0;

//  "/api/committee/funding/:cmteId/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  const queryCorporates = `
    SELECT
      count(DISTINCT employer_ticker) AS count,
      sum(total_transactions) AS total
    FROM
      "fec_company_committee_totals" AS a
    WHERE
      committee_id = $1
      AND year BETWEEN $2 AND $3;
  `;

  const queryCommittees = `
    SELECT
      count(DISTINCT a.committee_id) AS count,
      sum(a.total_transactions) AS total
    FROM
      "fec_inter_committee_summary" AS a
    WHERE
      a.other_id = $1
      AND a.year BETWEEN $2 AND $3;  
  `;

  const inputs = [req.params.cmteId, req.params.startYear, req.params.endYear];

  const results = await Promise.all([
    db.query(queryCorporates, inputs),
    db.query(queryCommittees, inputs),
  ]);

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  res.send({
      corporates: results[0].rows[0],
      committees: results[1].rows[0],
  });

  console.timeEnd(label);
};
