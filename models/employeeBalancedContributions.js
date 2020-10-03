var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('employeeBalancedContributionsCount',{
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        as_of: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'employee_balanced_contributions_count',
        timestamps: false
    }
    )
}