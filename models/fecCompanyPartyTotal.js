'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecCompanyPartyTotal', {
    employer_ticker: DataTypes.STRING,
    total_transactions: DataTypes.DOUBLE,
    party_affiliation: DataTypes.STRING,
    year: DataTypes.INTEGER,
    year_total: DataTypes.DOUBLE,
    percent_of_total: DataTypes.DOUBLE,
    year_total_affiliated: DataTypes.DOUBLE,
    percent_of_total_affiliated: DataTypes.DOUBLE
  }, {
    tableName: 'fec_company_party_totals',
    timestamps: false
  });
};