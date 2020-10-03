module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subsidiary', {
    parent_ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cleaned_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    echo_fac_registry_id: {
      type: DataTypes.BIGINT
    }
  }, {
    tableName: 'subsidiaries',
    timestamps: false
  });
};
