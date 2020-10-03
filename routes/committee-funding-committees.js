const db = require('../lib/db.js');

let count = 0;

// todo :: way too much duplication with company-committees. extrap-o-latte

//  "/api/committee/funding-committees/:cmteId/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  // todo, pagination? DONE
  // one way to handle this without having to ask for the total rowcount,
  // is to limit 11 but only display 10, and if you get a point where fewer than
  // 11 rows are returned, you're done...
  // next will always have at least one more if not in that situation.
  // kind of clever no?

  const queryCommittees = `
    SELECT
      a.committee_id,
      b.name,
      b.party_affiliation AS committee_party_affiliation,
      c.name AS candidate_name,
      c.party_affiliation AS candidate_party_affiliation,
      sum(a.total_transactions) AS total
    FROM
      fec_inter_committee_summary AS a
      LEFT JOIN fec_raw_committee_master AS b ON a.committee_id = b.id
      LEFT JOIN fec_raw_candidate_master AS c ON b.candidate_id = c.id
    WHERE
      a.other_id = $1
      AND a.year BETWEEN $2 AND $3
    GROUP BY
      a.committee_id,
      b.name,
      b.party_affiliation,
      c.name,
      c.party_affiliation
    ORDER BY 
      total DESC
    LIMIT $4
    OFFSET $5;
  `;

  const committees = await db.query(
    queryCommittees, [
      req.params.cmteId,
      req.params.startYear,
      req.params.endYear,
      (req.query.count || 10) * 1 + 1,
      req.query.start || 0,
    ],
  );
  const cmteIdParams = [];
  const inputs = [];

  committees.rows.forEach((cmte, idx) => {
    cmteIdParams.push(`$${idx + 1}`);
    inputs.push(cmte.committee_id);
  });

  inputs.push(req.params.startYear, req.params.endYear);

  const queryCommitteeParties = `
    SELECT DISTINCT
      committee_id,
      party_affiliation,
      sum(total_transactions) OVER (PARTITION BY committee_id, party_affiliation) AS party_total,
      sum(total_transactions) OVER (PARTITION BY committee_id) AS total,
      CASE WHEN sum(total_transactions) OVER (PARTITION BY committee_id) > 0 THEN
        LEAST(sum(total_transactions) OVER (PARTITION BY committee_id, party_affiliation) / sum(total_transactions) OVER (PARTITION BY committee_id), 1)
      ELSE
        NULL
      END AS percent_of_total
    FROM
      "fec_committee_party_totals"
    WHERE
      committee_id IN(${cmteIdParams.join(',')})
      AND year BETWEEN $${inputs.length - 1} AND $${inputs.length}
    ORDER BY
      committee_id,
      percent_of_total DESC
  `;

  const cmteSplits = {};
  const parties = await db.query(queryCommitteeParties, inputs);

  parties.rows.forEach((row) => {
    const cmte = cmteSplits[row.committee_id] || {
      DEM: {
        percent: 0, amount: 0,
      },
      REP: {
        percent: 0, amount: 0,
      },
      Other: {
        percent: 0, amount: 0,
      },
    };

    let pty = row.party_affiliation;

    if (pty !== 'REP' && pty !== 'DEM') {
      pty = 'Other';
    }

    cmte[pty].percent += row.percent_of_total * 1;
    cmte[pty].amount += row.party_total * 1;

    // needs to be sorted the same way as the first year
    cmteSplits[row.committee_id] = cmte;
  });

  committees.rows.forEach((row) => {
    row.parties = cmteSplits[row.committee_id] || null;
  });

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  res.send(
    committees.rows
  );

  console.timeEnd(label);
};
