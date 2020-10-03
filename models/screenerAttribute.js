var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ScreenerAttribute', {
      symbol: {
        type: Sequelize.STRING,
        allowNull: false
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      political_tilt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      employee_contributions_12_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      employee_balanced_contributions_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      num_facilities: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      num_facilities_ntile: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      num_facilities_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      fac_penalty_count_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fac_penalty_count_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      fac_last_penalty_amt_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fac_last_penalty_amt_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      caa_penalties_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      caa_penalties_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      caa_last_penalty_amt_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      caa_last_penalty_amt_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      cwa_penalties_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cwa_penalties_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      cwa_last_penalty_amt_sum: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cwa_last_penalty_amt_cdf: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      pct_women_board: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      pct_women_senior_mgt: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      pct_female_exec: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      pct_women_emplys: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      prmtn_career_devl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      living_wage_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eq_pay_pub: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eq_pay_pub3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eq_pay_strat: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eq_pay_gap: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eq_pay_gap3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parental_leave_primary: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parental_leave_secondary: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parental_leave_primary_num_weeks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parental_leave_secondary_num_weeks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      flex_hours: {
        type: Sequelize.STRING,
        allowNull: true
      },
      flex_loc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      training_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      equal_opportunity_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      anti_abuse_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      health_safety_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      human_rights_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      social_supply_chain_mgmt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sup_dvsty_program: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emp_prot_whistle_blower_policy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      wmns_empo_principle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certificate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      as_of: {
        type: Sequelize.DATE,
        allowNull: true
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sector_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      industry_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
    },
    {
      tableName: 'screener_attributes',
      timestamps: false
    }
  )
}
