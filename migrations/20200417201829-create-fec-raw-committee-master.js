module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fec_raw_committee_master', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      treasurer_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      street1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      street2: {
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
      designation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      party_affiliation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      filing_frequency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      interest_group_category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      connected_organization_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      candidate_id: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fec_raw_committee_master');
  }
};