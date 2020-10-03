'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE MATERIALIZED VIEW employee_contributions_12_year AS
WITH tilts AS (
    select c.id as company_id,
    c.ticker as company_symbol,
    c.name as company_name,
    sum(fcpt.total_transactions) as amount
    from companies as c
             join fec_company_party_totals as fcpt on c.ticker = fcpt.employer_ticker
    WHERE year BETWEEN extract(YEAR FROM CURRENT_DATE - INTERVAL '12 YEARS') AND extract(YEAR FROM CURRENT_DATE)
    group by 1
    order by 1
)
SELECT row_number() OVER (PARTITION BY true) AS id, *, now()::date as as_of
from tilts
    `, {type: Sequelize.QueryTypes.RAW}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    DROP MATERIALIZED VIEW employee_contributions_12_year
    `, {type: Sequelize.QueryTypes.RAW}
    )
  }
};
