module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Exchange', {
    name: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
};