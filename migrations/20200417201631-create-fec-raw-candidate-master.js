module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fec_raw_candidate_master', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      party_affiliation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      election_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      office_street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      office: {
        type: Sequelize.STRING,
        allowNull: true
      },
      office_district: {
        type: Sequelize.STRING,
        allowNull: true
      },
      incumbent_challenger_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      principal_campaign_committee: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address2: {
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fec_raw_candidate_master');
  }
};