const tableName = "fundamentals";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(tableName, {
        ticker: {
          type: Sequelize.STRING
        },
        employee_count: {
          type: Sequelize.INTEGER
        }
      }, {
        uniqueKeys: {
          fundamentals_unique: {
            fields: ["ticker"]
          }
        }
      });

      // await queryInterface.addIndex(tableName, ["ticker"], { transaction });
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