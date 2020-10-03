var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Industry', {
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sector_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
  }, {
    tableName: 'industries',
    timestamps: false
  })
}
