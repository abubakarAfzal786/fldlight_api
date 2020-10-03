const db = require('../lib/db.js');

let count = 0;

//  "/api/committee/funding-companies/:cmteId/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  // todo, pagination? DONE
  // one way to handle this without having to ask for the total rowcount,
  // is to limit 11 but only display 10, and if you get a point where fewer than
  // 11 rows are returned, you're done...
  // next will always have at least one more if not in that situation.
  // kind of clever no?

  const queryCompanies = `
    SELECT
      employer_ticker,
      b.name,
      sum(total_transactions) AS total
    FROM
      "fec_company_committee_totals" as a
    INNER JOIN companies as b on a.employer_ticker = b.ticker
    WHERE
      committee_id = $1
      AND year BETWEEN $2 AND $3
    GROUP BY
      employer_ticker, b.name
    ORDER BY
      total DESC
    LIMIT $4
    OFFSET $5;
  `;

  const results = await db.query(queryCompanies, [
    req.params.cmteId,
    req.params.startYear,
    req.params.endYear,
    (req.query.count || 10) * 1 + 1,
    req.query.start || 0,
  ]);

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  res.send(
    results.rows
  );

  console.timeEnd(label);
};
