const tableName = "fec_raw_inter_committee_transactions";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        filer_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        amendment_indicator: {
          type: Sequelize.STRING,
          allowNull: true
        },
        report_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        primary_general_indicator: {
          type: Sequelize.STRING,
          allowNull: true
        },
        image_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        transaction_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        entity_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true
        },
        zip_code: {
          type: Sequelize.STRING,
          allowNull: true
        },
        employer: {
          type: Sequelize.STRING,
          allowNull: true
        },
        occupation: {
          type: Sequelize.STRING,
          allowNull: true
        },
        transaction_date: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        transaction_amount: {
          type: Sequelize.DECIMAL,
          precision: 14,
          scale: 2,
          allowNull: true
        },
        other_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        transaction_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        file_number: {
          type: Sequelize.DOUBLE,
          allowNull: true
        },
        memo_code: {
          type: Sequelize.STRING,
          allowNull: true
        },
        memo_text: {
          type: Sequelize.STRING,
          allowNull: true
        },
        fec_record_number: {
          type: Sequelize.DECIMAL,
          precision: 19,
          allowNull: false,
          primaryKey: true
        }
      });

      // await queryInterface.addIndex(tableName, ["filer_id"], { transaction });
      // await queryInterface.addIndex(tableName, ["other_id"], { transaction });
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  }
};