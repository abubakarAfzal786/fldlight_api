const Sequelize = require('sequelize')
const path = require('path')
const Umzug = require('./lib/umzug')
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const sequelize = new Sequelize(process.env[config.use_env_variable])

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, './migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ]
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'SequelizeMeta',
    tableName: 'SequelizeMeta',
  }
});

module.exports = (async () => {
  try {
    console.log('Migration start')
    await umzug.up.bind(umzug)();
    console.log('All migrations performed successfully')
  } catch (error) {
    console.log(error)
  }
})();
