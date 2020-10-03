const { Pool } = require('pg');

const URI = process.env.DATABASE_URL
  || `postgres://${process.env.USER}@localhost:5432/floodlight`;

const pool = new Pool({
  connectionString: URI,
});

async function query(q, inputs) {
  const client = await pool.connect();
  let response;

  try {
    response = await client.query(q, inputs);
  } catch (e) {
    // console.error(e.detail || e.message || e);
    throw e.detail || e.message || e;
    // these should not crash the process, hence the log
  } finally {
    client.release();
  }

  return response || { rows: [] };
}

module.exports = {
  query,
};
