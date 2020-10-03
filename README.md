# Floodlight Platform Backend

## Install

```bash

> git clone
> npm install

```

## Environment
No Dockers or Vagrants - use local machine resources. 
At a minimum, you'll need Postgres running locally. If not already installed, 
[here are some basic instructions to do so](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3).
The following should go into a `.env` file at the project root:
```
NODE_ENV=development
AUTH0_AUDIENCE=https://dev-api.floodlightinvest.com/
AUTH0_DOMAIN=dev-floodlight.auth0.com
AUTH0_MANAGEMENT_DOMAIN=dev-floodlight.auth0.com
DATABASE_URL=postgres://postgres@localhost:5432/floodlight_development
ELASTICSEARCH_URL=https://vpc-floodlight-dev-g2cxlqlcpjdst44uqgbziadb5a.us-west-2.es.amazonaws.com:9200
```

This assumes you've created a local `floodlight_development` database that can be accessed with a `postgres` user, empty password. 

## Run

```bash
  node app.js
```

Run with pretty printed logs:

```bash
  node app.js | pino-pretty
```

## Workflow
Deployment pipelines are run through [Gitlab](https://gitlab.com/floodlight-invest/api). Development work should be done in branches off the `develop` branch. Merges to `master` can be done via pull request via Gitlab.

## Database
This app sits in front of Postgres, with Sequelize as an ORM. This is in place less for query convenience 
than for migrations and schema management.

### create new table/model
- `npx sequelize-cli model:generate --name User --attributes id:integer,email:string,password:string`
- `npx sequelize-cli db:migrate`

### Refresh Materialized Views
If 
"companies" or 
"fec_company_party_totals" table data changes then these command need to be run.

- `REFRESH MATERIALIZED VIEW political_tilts`
- `REFRESH MATERIALIZED VIEW employee_contributions_12_year`
- `REFRESH MATERIALIZED VIEW employee_balanced_contributions_count`

If 
"companies" or 
"equileap_data" or 
"political_tilts" or 
"employee_contributions_12_year" or 
"employee_balanced_contributions_count" or
"facility_violation" table data changes then this command needs to be run.

- `REFRESH MATERIALIZED VIEW screener_attributes`

## Auth Services
Are implemented via JWTs issued by Auth0. The code in `lib/auth0-service.js` also handles integration 
with the auth0 management API for things like updating user data. 


## Mail
uses nodemailer

For development, create an account on https://mailtrap.io/ and plug in your credentials in `lib/mailer.js` 
