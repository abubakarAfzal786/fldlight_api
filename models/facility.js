'use strict';
module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define('Facility', {
    registry_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    long: DataTypes.DECIMAL
  }, {});

  return Facility;
};