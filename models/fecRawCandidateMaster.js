'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecRawCandidateMaster', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    party_affiliation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    election_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    office_street: {
      type: DataTypes.STRING,
      allowNull: true
    },
    office: {
      type: DataTypes.STRING,
      allowNull: true
    },
    office_district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    incumbent_challenger_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    principal_campaign_committee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
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
    }
  }, {
    tableName: 'fec_raw_candidate_master',
    timestamps: false
  });
};