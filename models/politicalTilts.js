var Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PoliticalTilt',{
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        company_symbol: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tilt: {
            type: Sequelize.STRING,
            allowNull: true
        },
        as_of: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'political_tilt',
        timestamps: false
    }
    )
}