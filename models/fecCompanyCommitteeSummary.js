module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecCompanyCommitteeSummary', {
    employer_ticker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    committee_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_transactions: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    party_affiliation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: "fec_company_committee_summary",
    timestamps: false
  });
};
