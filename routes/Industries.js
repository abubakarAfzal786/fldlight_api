const models = require('../models');

module.exports = async (req, res) => {
  try {
    const Industries = await models.Industry.findAll({
      where: {
        sector_id: req.params.sectorId
      },
    })
    res.send(Industries);
  } catch (e) {
    res.status(500).send(e);
  }
}