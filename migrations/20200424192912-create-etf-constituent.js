module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('etf_constituents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fund_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'etf_funds',
          key: 'id'
        }
      },
      ticker: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.DECIMAL,
        precision: 8,
        scale: 5,
      },
      exchange: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      asset_class: {
        type: Sequelize.STRING
      },
      market_value: {
        type: Sequelize.DECIMAL,
        precision: 8,
        scale: 5,
      },
      location: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      market_currency: {
        type: Sequelize.STRING
      },
      fx_rate: {
        type: Sequelize.DECIMAL,
        precision: 2,
        scale: 5,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('etf_constituents');
  }
};