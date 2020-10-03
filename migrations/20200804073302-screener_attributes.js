'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
CREATE MATERIALIZED VIEW screener_attributes AS
WITH screener AS (
    SELECT c.ticker AS symbol,
           c.id AS company_id,
           c.name AS company_name,
           st.id AS sector_id,
           c.sector AS sector,
           s_i.id AS industry_id,
           pt.tilt   AS political_tilt,
           ec.amount AS employee_contributions_12_year,
           ebc.count AS employee_balanced_contributions_count,   
           fv.num_facilities,
           fv.num_facilities_ntile,
           fv.num_facilities_cdf,
           fv.fac_penalty_count_sum,
           fv.fac_penalty_count_cdf,
           fv.fac_last_penalty_amt_sum,
           fv.fac_last_penalty_amt_cdf,
           fv.caa_penalties_sum,
           fv.caa_penalties_cdf,
           fv.caa_last_penalty_amt_sum,
           fv.caa_last_penalty_amt_cdf,
           fv.cwa_penalties_sum,
           fv.cwa_penalties_cdf,
           fv.cwa_last_penalty_amt_sum,
           fv.cwa_last_penalty_amt_cdf,
           ed.pct_women_board,
           ed.pct_female_exec,
           ed.pct_women_senior_mgt,
           ed.pct_women_emplys,
           ed.prmtn_career_devl,
           ed.living_wage_policy,
           ed.eq_pay_pub,
           ed.eq_pay_pub3,
           ed.eq_pay_strat,
           ed.eq_pay_gap,
           ed.eq_pay_gap3,
           ed.parental_leave_primary,
           ed.parental_leave_secondary,
           ed.parental_leave_primary_num_weeks,
           ed.parental_leave_secondary_num_weeks,
           ed.flex_hours,
           ed.flex_loc,
           ed.training_policy,
           ed.equal_opportunity_policy,
           ed.anti_abuse_policy,
           ed.health_safety_policy,
           ed.human_rights_policy,
           ed.social_supply_chain_mgmt,
           ed.sup_dvsty_program,
           ed.emp_prot_whistle_blower_policy,
           ed.wmns_empo_principle,
           ed.certificate
    FROM companies AS c
             LEFT JOIN equileap_data AS ed on ed.symbol = c.ticker
             LEFT JOIN political_tilts AS pt on c.id = pt.company_id
             LEFT JOIN sectors AS st on st.name = c.sector
             LEFT JOIN industries AS s_i on s_i.name = c.industry
             LEFT JOIN employee_contributions_12_year AS ec on c.id = ec.company_id
             LEFT JOIN employee_balanced_contributions_count AS ebc on c.id = ebc.company_id
             LEFT JOIN report.facility_violation AS fv on c.ticker = fv.ticker
)

SELECT row_number() OVER (PARTITION BY true) AS id, *, now()::date as as_of
FROM screener;
    `, {type: Sequelize.QueryTypes.RAW}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    DROP MATERIALIZED VIEW screener_attributes
    `, {type: Sequelize.QueryTypes.RAW}
    )
  }
};
