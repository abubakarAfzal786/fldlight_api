const companyFacilities = require('../contexts/company-facilities');

/**
 * handler for POST /api/company_facilities
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
    const companyFacility = await companyFacilities.create({
      company_id: parseInt(req.body.company_id, 10),
      facility_id: parseInt(req.body.facility_id, 10)
    });

    if (companyFacility) {
      res.send({data: companyFacility});
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

/**
 * handler for DELETE /api/company_facilities
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const destroy = async (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  try {
    await companyFacilities.destroy({where: {id: req.params.id}});
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  create,
  destroy
};
