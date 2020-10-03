const tableName = "fec_contributions_by_individuals";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        id: {
        allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER
        },
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
          type: Sequelize.DOUBLE,
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
          type: Sequelize.DOUBLE,
            allowNull: false,
            primaryKey: true
        },
        employer_clean: {
          type: Sequelize.STRING,
            allowNull: true
        },
        employer_ticker: {
          type: Sequelize.STRING,
            allowNull: true
        },
        name_clean: {
          type: Sequelize.STRING,
            allowNull: true
        },
        employer_classification_score: {
          type: Sequelize.DOUBLE,
            allowNull: true
        }
      });

      // await queryInterface.addIndex(tableName, ["employer_ticker"], { transaction });
      // await queryInterface.addIndex(tableName, ["name_clean"], { transaction });
      // await queryInterface.addIndex(tableName, ["transaction_date"], { transaction });
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