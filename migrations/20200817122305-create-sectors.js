'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
CREATE TABLE sectors AS
WITH screener AS (      
  SELECT  DISTINCT c.sector AS name
  FROM companies AS c ORDER BY 1
)
SELECT row_number() OVER (PARTITION BY true) AS id, *, now()::date as as_of
FROM screener;
 `, {type: Sequelize.QueryTypes.RAW}
    )
  },      

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    DROP TABLE sectors
    `, {type: Sequelize.QueryTypes.RAW}
    )
  }
};
