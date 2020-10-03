'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecRawCommitteeMaster', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    treasurer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    party_affiliation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filing_frequency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    interest_group_category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    connected_organization_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    candidate_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'fec_raw_committee_master',
    timestamps: false
  });
};