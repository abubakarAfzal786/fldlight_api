'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        'subsidiaries',
        'echo_fac_registry_id',
        Sequelize.BIGINT,
        { transaction }
      );
      await queryInterface.addIndex('subsidiaries', ['echo_fac_registry_id'], { unique: true, transaction });
      await transaction.commit();

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeIndex('subsidiaries', ['echo_fac_registry_id'], { transaction });
      await queryInterface.removeColumn(
        'subsidiaries',
        'echo_fac_registry_id',
        { transaction }
      );
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
