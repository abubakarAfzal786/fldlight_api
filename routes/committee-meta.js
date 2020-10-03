const db = require('../lib/db.js');

let count = 0;

//  "/api/committee/meta/:cmteId/:startYear/:endYear/"

module.exports = async (req, res) => {
  const label = `${count++} API REQ ${req.path}`;
  console.time(label);

  const queryMeta = `
    SELECT
      a.id AS committee_id,
      a.name,
      a.city,
      a.state,
      a.designation,
      a.type,
      a.party_affiliation AS committee_party_affiliation,
      a.interest_group_category,
      a.connected_organization_name,
      a.candidate_id,
      b.name AS candidate_name,
      a.party_affiliation AS committee_party_affiliation,
      b.election_year AS candidate_election_year,
      b.office AS candidate_office,
      b.office_street AS candidate_office_street,
      b.office_district AS candidate_office_district,
      b.incumbent_challenger_status,
      b.status AS candidate_status,
      b.principal_campaign_committee,
      c.name as principal_campaign_committee_name
    FROM
      "fec_raw_committee_master" AS a
      LEFT JOIN "fec_raw_candidate_master" AS b ON a.candidate_id = b.id
      LEFT JOIN "fec_raw_committee_master" AS c ON b.principal_campaign_committee = c.id
    WHERE
      a.id = $1
  `;

  const queryDownstream = `
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
      committee_id = $1
      AND year BETWEEN $2 AND $3
    ORDER BY
      committee_id,
      percent_of_total DESC
  `;

  const results = await Promise.all([
    db.query(queryMeta, [req.params.cmteId]),
    db.query(queryDownstream, [req.params.cmteId, req.params.startYear, req.params.endYear]),
  ]);

  const parties = {
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

  results[1].rows.forEach((row) => {
    let pty = row.party_affiliation;

    if (pty !== 'REP' && pty !== 'DEM') {
      pty = 'Other';
    }

    parties[pty].percent += row.percent_of_total * 1;
    parties[pty].amount += row.party_total * 1;
  });

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });

  res.send({
      parties,
      meta: results[0].rows[0],
  });

  console.timeEnd(label);
};
