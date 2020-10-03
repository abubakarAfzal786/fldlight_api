const tableName = "fec_committee_party_totals";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        committee_id: {
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
        year_total: {
          type: Sequelize.DOUBLE
        },
        percent_of_total: {
          type: Sequelize.DOUBLE
        }
      }, { transaction });

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