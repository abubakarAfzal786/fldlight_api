var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const EmployeeContributions = sequelize.define('EmployeeContributions',{
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        company_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        company_symbol: {
            type: Sequelize.STRING,
            allowNull: true
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        as_of: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'employee_contributions_12_year',
        timestamps: false
    }
    )
    EmployeeContributions.associate = function(models) {
        EmployeeContributions.belongsTo(models.PoliticalTilt);
    };
    return EmployeeContributions
}