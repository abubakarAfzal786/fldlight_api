const db = require('../lib/db.js');

let count = 0;

//  "/api/company/employees/:ticker/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  // todo, pagination? DONE
  // one way to handle this without having to ask for the total rowcount,
  // is to limit 11 but only display 10, and if you get a point where fewer than
  // 11 rows are returned, you're done...
  // next will always have at least one more if not in that situation.
  // kind of clever no?

  const queryEmployees = `
    SELECT
      name_clean,
      max(name) as display_name,
      max(employer_clean) as employer,
      max(occupation) AS occupation,
      max(city) AS city,
      max(state) AS state,
      sum(transaction_amount) AS total,
      count(transaction_amount) AS count
    FROM
      "fec_contributions_by_individuals"
    WHERE
      employer_ticker = $1
      AND EXTRACT(YEAR FROM transaction_date) BETWEEN $2 AND $3
    GROUP BY
     name_clean
    ORDER BY
    total DESC
    LIMIT 10 
    OFFSET 0;
  `;

  const results = await db.query(queryEmployees, [
    req.params.ticker, req.params.startYear, req.params.endYear,
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
