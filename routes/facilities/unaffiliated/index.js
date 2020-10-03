const db = require('../../../lib/db.js');

/**
 * handler for /api/facilities/unaffiliated?q=
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const index = async (req, res) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  const queryString = req.query["q"];

  const query = `
      SELECT f.id, f.name
      FROM facilities f
      LEFT JOIN company_facilities cf ON f.id = cf.facility_id
      WHERE cf.company_id IS NULL AND f.name ILIKE $1
      ORDER BY f.name
      LIMIT 100;
  `;

  const facilitiesList = await db.query(query, ['%' + queryString + '%']);
  res.send({data: facilitiesList.rows});
};

module.exports = {
  index
};
