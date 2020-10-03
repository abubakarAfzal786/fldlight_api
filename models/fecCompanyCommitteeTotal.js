'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecCompanyCommitteeTotal', {
    employer_ticker: DataTypes.STRING,
    committee_id: DataTypes.STRING,
    other_type: DataTypes.STRING,
    total_transactions: DataTypes.DOUBLE,
    party_affiliation: DataTypes.STRING,
    year: DataTypes.INTEGER,
    party_derived: DataTypes.STRING,
    party_empty_validated: DataTypes.BOOLEAN
  }, {
    tableName: 'fec_company_committee_totals',
    timestamps: false
  });
};