'use strict';
module.exports = (sequelize, DataTypes) => {
  const CompanyFacility = sequelize.define('CompanyFacility', {
    company_id: DataTypes.INTEGER,
    facility_id: DataTypes.INTEGER
  }, {tableName: 'company_facilities'});

  CompanyFacility.associate = function(models) {
    CompanyFacility.belongsTo(models.Company);
    CompanyFacility.belongsTo(models.Facility);
  };

  return CompanyFacility;
};