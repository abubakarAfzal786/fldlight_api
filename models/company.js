module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Company', {
    ticker: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cik: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sp500: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sp100: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  },
    {
      tableName: 'companies',
      timestamps: false
    });
};
