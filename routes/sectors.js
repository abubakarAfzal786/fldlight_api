const models = require('../models');

module.exports = async (req, res) => {
  try {
    const allSectors = await models.Sectors.findAll({
      attribute:['name','id'],
      order: [
        ['name', 'ASC']
      ]
    });

    res.send(allSectors);
  } catch (e) {
    res.status(500).send(e);
  }
}
