'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FecRawInterCommitteeTransaction', {
    filer_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amendment_indicator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    report_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primary_general_indicator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
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
    employer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    transaction_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    other_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_number: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    memo_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    memo_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fec_record_number: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: "fec_raw_inter_committee_transactions",
    timestamps: false
  });
};