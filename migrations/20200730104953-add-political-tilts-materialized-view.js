'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE MATERIALIZED VIEW political_tilts AS
WITH tilts AS (
    select c.id                                                         as company_id,
           coalesce(NULLIF(fcpt.party_affiliation, ''), 'unaffiliated') as tilt,
           sum(fcpt.total_transactions)                                 AS total_contributed
    from companies as c
             join fec_company_party_totals as fcpt on c.ticker = fcpt.employer_ticker
    where fcpt.party_affiliation in ('', 'REP', 'DEM')
      AND year BETWEEN extract(YEAR FROM CURRENT_DATE - INTERVAL '4 YEARS') AND extract(YEAR FROM CURRENT_DATE)
    group by 1, 2
    order by 1
),
     distinct_tilts AS (
         SELECT DISTINCT ON (company_id) company_id, tilt
         FROM tilts
         ORDER BY company_id, total_contributed DESC
     )
SELECT row_number() OVER (PARTITION BY true) AS id, *, now()::date as as_of
from distinct_tilts;
      `,
      {type: Sequelize.QueryTypes.RAW}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'DROP MATERIALIZED VIEW political_tilts',
      {type: Sequelize.QueryTypes.RAW}
    )
  }
};
