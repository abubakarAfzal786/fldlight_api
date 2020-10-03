require('dotenv').config();

module.exports = {
  "development": {
    "use_env_variable": "DATABASE_URL",
    "logging": false
  },
  "dev": {
    "use_env_variable": "DATABASE_URL",
    "logging": false
  },
  "test": {
    "use_env_variable": "DATABASE_URL",
    "logging": false
  },
  "staging": {
    "use_env_variable": "DATABASE_URL",
    "logging": false
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "logging": false
  }
}
