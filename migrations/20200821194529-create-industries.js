'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
CREATE TABLE industries AS
WITH screener AS (
  SELECT DISTINCT c.industry AS name,st.id AS sector_id
  FROM companies AS c 
  LEFT JOIN sectors as st on st.name = c.sector
)
SELECT row_number() OVER (PARTITION BY true) AS id, *, now()::date as as_of
FROM screener;
 `, {type: Sequelize.QueryTypes.RAW}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    DROP TABLE industries
    `, {type: Sequelize.QueryTypes.RAW}
    )
  }
};
