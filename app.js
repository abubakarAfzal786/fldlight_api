require('dotenv').config();

const serverless = require('serverless-http');
const express = require('express');
const expressLogger = require('express-pino-logger');
const logger = require('./lib/logger.js');
const auth = require('./lib/auth');
const bodyParser = require('body-parser');
const db = require('./models');
const migrator = require('./migrator')

const app = express();
app.disable('x-powered-by');
app.use(expressLogger({ logger }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': "*",
    'Access-Control-Allow-Credentials': true
  });
  next();
});
let paginator = require('./middlewares/paginator')
app.all("*", paginator)

const port = process.env.PORT || 3000;

const overall = require('./routes/overall.js');
const plans = require('./routes/plans.js');
const products = require('./routes/products.js');
const subscriptions = require('./routes/subscriptions.js');
const contact = require('./routes/contact.js');
const comparisons = require('./routes/comparisons');
const assessment = require('./routes/assessment')

const companyStats = require('./routes/company-stats.js');
const companySearch = require('./routes/company-search.js'); // dying...
const search = require('./routes/search.js');
const companyTimeseries = require('./routes/company-timeseries.js');
const companyCommittees = require('./routes/company-committees.js');
const companyEmployees = require('./routes/company-employees.js');
const companyEmployeeTransactions = require('./routes/company-employee-transactions.js');

const committeeMeta = require('./routes/committee-meta.js');
const committeeFunding = require('./routes/committee-funding.js');
const committeeFundingCompanies = require('./routes/committee-funding-companies.js');
const committeeFundingCommittees = require('./routes/committee-funding-committees.js');
const committeeCommittees = require('./routes/committee-committees.js');
const companies = require('./routes/companies.js');
const funds = require('./routes/funds.js');
const subsidiaries = require('./routes/subsidiaries.js');
const companyFacilities = require('./routes/company-facilities.js');
const echoFacilities = require('./routes/facilities/unaffiliated');
const Industry = require('./routes/Industries');
const sectors = require('./routes/sectors');

app.get(
  '/sectors/:sectorId/industries',
  Industry
);

app.get(
  '/sectors',
  sectors
);

app.get(
  '/overall/:startYear/:endYear/',
  overall,
);

app.get(
  '/company/stats/:ticker/:startYear/:endYear/',
  auth,
  companyStats,
);

app.get(
  '/funds/:ticker',
  auth,
  funds.show,
);

app.get(
  '/funds/:ticker/holdings',
  auth,
  funds.holdings,
);

app.get(
  '/funds/:ticker/stats',
  auth,
  funds.stats,
);

app.get(
  '/companies',
  // auth,
  companies.index,
);

app.get(
  '/companies/:ticker/subsidiaries',
  auth,
  subsidiaries.index,
);

// app.post(
//   '/companies/:ticker/subsidiaries',
//   // //auth,
//   subsidiaries.create,
// );

app.post(
  '/company_facilities',
  auth,
  companyFacilities.create,
);

app.post(
  '/assessment',
  assessment,
)

app.delete(
  '/company_facilities/:id',
  auth,
  companyFacilities.destroy,
);

app.get(
  '/echo/facilities/unaffiliated',
  auth,
  echoFacilities.index,
);

app.get(
  '/company/stats/:ticker',
  auth,
  companyStats,
);

app.get(
  '/company/of-the-day',
  companyStats,
);

app.get(
  '/company/search',
  //auth,
  companySearch
);

// generic search across multiple things
app.get(
  '/search',
  //auth,
  search
);

app.get(
  '/company/timeseries/:ticker/:startYear/:endYear/',
  auth,
  companyTimeseries,
);

app.get(
  '/company/committees/:ticker/:startYear/:endYear/',
  auth,
  companyCommittees,
);

app.get(
  '/company/employees/:ticker/:startYear/:endYear/',
  auth,
  companyEmployees,
);

app.get(
  '/company/employee-transactions/:ticker/:startYear/:endYear/',
  auth,
  companyEmployeeTransactions,
);

app.get(
  '/committee/meta/:cmteId/:startYear/:endYear/',
  auth,
  committeeMeta,
);

app.get(
  '/committee/funding/:cmteId/:startYear/:endYear/',
  auth,
  committeeFunding,
);

app.get(
  '/committee/funding-companies/:cmteId/:startYear/:endYear/',
  auth,
  committeeFundingCompanies,
);

app.get(
  '/committee/funding-committees/:cmteId/:startYear/:endYear/',
  auth,
  committeeFundingCommittees,
);

app.get(
  '/committee/committees/:cmteId/:startYear/:endYear/',
  auth,
  committeeCommittees,
);

app.get(
  '/plans',
  plans,
);

app.get(
  '/products',
  products,
);

app.get(
  '/comparisons',
  comparisons,
)

app.post(
  '/subscriptions/contact',
  auth,
  subscriptions.contact,
);

app.post(
  '/contact',
  contact.create,
);

app.patch(
  '/subscriptions',
  auth,
  subscriptions.update,
);

app.put(
  '/subscriptions',
  auth,
  subscriptions.update,
);

console.log('Before Sync')

  db.sequelize.sync().then(function() {
    console.log('In Sync')
    app.listen(port, () => {
      logger.info(
        `Floodlight API listening on port ${port} in ${process.env.NODE_ENV}!`,
      );
    });
  });

if (process.env.NODE_ENV !== 'development') {
  module.exports.handler = serverless(app);
}
