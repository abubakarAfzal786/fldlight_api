'use strict';
module.exports = (sequelize, DataTypes) => {
  const EtfConstituent = sequelize.define('EtfConstituent', {
    fund_id: DataTypes.INTEGER,
    ticker: DataTypes.STRING,
    name: DataTypes.STRING,
    weight: DataTypes.DECIMAL,
    exchange: DataTypes.STRING,
    date: DataTypes.DATE,
    asset_class: DataTypes.STRING,
    market_value: DataTypes.DECIMAL,
    location: DataTypes.STRING,
    currency: DataTypes.STRING,
    market_currency: DataTypes.STRING,
    fx_rate: DataTypes.DECIMAL,
  }, {
    tableName: 'etf_constituents',
    timestamps: false
  });

  EtfConstituent.associate = function(models) {
    EtfConstituent.belongsTo(models.EtfFund);
  };

  return EtfConstituent;
};