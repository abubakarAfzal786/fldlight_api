const funds = require('../contexts/funds');
const elections = require('../contexts/elections');

/**
 * handler for /api/funds/:ticker
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const show = async (req, res) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  const ticker = req.params.ticker.toUpperCase();
  const fund = await funds.get(ticker);

  if (fund === null) {
    console.log('Not found!');
    res.status(404).send();

  } else {
    res.send({data: fund});
  }
};

/**
 * handler for /api/funds/:ticker/holdings
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const holdings = async function(req, res){

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  const ticker = req.params.ticker.toUpperCase();
  const fund = await funds.get(ticker);

  if (fund === null) {
    res.status(404).send();

  } else {
    const holdings = await funds.holdingsWithContributions(fund);
    res.send({data: holdings});
  }
};

/**
 * handler for /api/funds/:ticker/stats
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const stats = async (req, res) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  });

  const ticker = req.params.ticker.toUpperCase();
  const fund = await funds.get(ticker);

  if (fund === null) {
    res.status(404).send();
    return;
  }

  const dates = dateRangeParamsToDates(req.query.type, req.query.count, req.query.start, req.query.end);
  const stats = await funds.stats(fund, dates);
  res.send({data: stats});
};

const dateRangeParamsToDates = (type, count, startYear, endYear) => {
  if (type === 'cycle'){
    return elections.getCycleDatesByEndYear(parseInt(endYear, 10));
  }

  if (type === 'recent'){
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const sinceWhen = new Date();
    sinceWhen.setFullYear( currentYear - parseInt(count,10));
    return [sinceWhen, now];
  }

  return [elections.currentCycleStart(), elections.currentCycleEnd()];
};

module.exports = {
  show,
  holdings,
  stats
};
