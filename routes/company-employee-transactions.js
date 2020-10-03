const db = require('../lib/db.js');

let count = 0;

//  "/api/company/employee-transactions/:ticker/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  // todo, pagination? DONE
  // one way to handle this without having to ask for the total rowcount,
  // is to limit 11 but only display 10, and if you get a point where fewer than
  // 11 rows are returned, you're done...
  // next will always have at least one more if not in that situation.
  // kind of clever no?

  const queryTransactions = `
    SELECT
      a.filer_id AS committee_id,
      a.fec_record_number,
      a.name,
      a.city,
      a.state,
      a.employer,
      a.occupation,
      a.transaction_date,
      a.transaction_amount,
      b.name AS committee_name,
      b.party_affiliation AS committee_party_affiliation,
      b.candidate_id,
      b.connected_organization_name,
      c.name AS candidate_name,
      c.party_affiliation AS candidate_party_affiliation,
      c.office AS candidate_office,
      c.office_district AS candidate_office_district,
      c.office_street AS candidate_office_street
    FROM
      "fec_contributions_by_individuals" AS a
      INNER JOIN "fec_raw_committee_master" AS b ON a.filer_id = b.id
      LEFT JOIN "fec_raw_candidate_master" AS c ON b.candidate_id = c.id
    WHERE
      a.employer_ticker = $1
      AND a.name_clean = $2
      AND EXTRACT(YEAR from a.transaction_date) BETWEEN $3 and $4
    ORDER BY
      a.transaction_date DESC
    LIMIT $5
    OFFSET $6;
  `;

  const transactions = await db.query(
    queryTransactions, [
      req.params.ticker,
      req.query.name,
      req.params.startYear,
      req.params.endYear,
      (req.query.count || 10) * 1 + 1,
      req.query.start || 0,
    ],
  );

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  res.send(
    transactions.rows
  );

  console.timeEnd(label);
};
