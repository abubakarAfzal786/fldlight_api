module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecCommitteePartyTotals', {
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
    },
    year_total: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    percent_of_total: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    tableName: "fec_committee_party_totals",
    timestamps: false
  });
};
