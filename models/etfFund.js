module.exports = (sequelize, DataTypes) => {
  const EtfFund = sequelize.define('EtfFund', {
    ticker: DataTypes.STRING,
    name: DataTypes.STRING,
    product_name: DataTypes.STRING,
    company: DataTypes.STRING
  }, {
    tableName: 'etf_funds',
    timestamps: false
  });

  EtfFund.associate = function(models) {
    EtfFund.hasMany(models.EtfConstituent);
  };


  return EtfFund;
};