const subsidiaries = require('../contexts/subsidiaries');

/**
 * handler for GET /api/companies/:symbol/subsidiaries
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const index = async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  const ticker = req.params.ticker.toUpperCase();
  const subsidiariesList = await subsidiaries.index(ticker);
  res.send({data: subsidiariesList});
};

/**
 * handler for POST /api/companies/:symbol/subsidiaries
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const create = async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  try {
    const subsidiary = await subsidiaries.create({
      parent_ticker: req.body.parent_ticker,
      name: req.body.name,
      echo_fac_registry_id: parseInt(req.body.echo_fac_registry_id, 10)
    });

    if (subsidiary) {
      res.send({data: subsidiary});
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

//// DELETE single owner
//   app.delete('/owner/:id', (req, res) => {
//     const id = req.params.id;
//     db.owners.destroy({
//       where: { id: id }
//     })
//       .then(deletedOwner => {
//         res.json(deletedOwner);
//       });
//   });

module.exports = {
  index,
  create
};
