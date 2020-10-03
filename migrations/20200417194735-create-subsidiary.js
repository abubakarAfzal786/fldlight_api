module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subsidiaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parent_ticker: {
        type: Sequelize.STRING,
        references: {
          model: 'companies',
          key: 'ticker'
        }
      },
      name: {
        type: Sequelize.STRING
      },
      cleaned_name: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subsidiaries');
  }
};