var Sequelize = require('sequelize');

module.exports = (sequelize /*, DataTypes */) => {
  return sequelize.define('Sectors', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true    
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, {
    tableName: 'sectors',
    timestamps: false
  })
}
