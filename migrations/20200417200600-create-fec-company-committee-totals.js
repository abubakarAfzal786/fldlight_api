const tableName = "fec_company_committee_totals";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        employer_ticker: {
          type: Sequelize.STRING
        },
        committee_id: {
          type: Sequelize.STRING
        },
        other_type: {
          type: Sequelize.STRING
        },
        total_transactions: {
          type: Sequelize.DOUBLE
        },
        party_affiliation: {
          type: Sequelize.STRING
        },
        year: {
          type: Sequelize.INTEGER
        },
        party_derived: {
          type: Sequelize.STRING
        },
        party_empty_validated: {
          type: Sequelize.BOOLEAN
        }
      });

      // await queryInterface.addIndex(tableName, ["employer_ticker"], { transaction });
      // await queryInterface.addIndex(tableName, ["committee_id"], { transaction });
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