module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('etf_funds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticker: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      product_name: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      download_url: {
        type: Sequelize.STRING
      },
      inception_date: {
        type: Sequelize.DATEONLY
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('etf_funds');
  }
};