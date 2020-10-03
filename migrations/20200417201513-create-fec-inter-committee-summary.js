const tableName = "fec_inter_committee_summary";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        committee_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        other_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        other_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        total_transactions: {
          type: Sequelize.DOUBLE,
          allowNull: true
        },
        party_affiliation: {
          type: Sequelize.STRING,
          allowNull: true
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      });

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