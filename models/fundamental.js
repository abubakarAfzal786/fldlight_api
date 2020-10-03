'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Fundamental', {
    ticker: DataTypes.STRING,
    employee_count: DataTypes.INTEGER
  }, {
    tableName: "fundamentals",
    timestamps: false
  });
};