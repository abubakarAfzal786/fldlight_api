'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecInterCommitteeSummary', {
    committee_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    other_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    other_type: {
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
    tableName: 'fec_inter_committee_summary',
    timestamps: false
  });
};