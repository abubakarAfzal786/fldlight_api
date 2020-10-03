const nodemailer = require('nodemailer');

const configs = {
  production: {
    host: 'smtp.office365.com',
    user: 'support@floodlightinvest.com',
    pass: 'wEojicGNF2uxzoWB4UKW',
    port: 587,
  },
  development: {
    host: 'smtp.mailtrap.io',
    user: '84cfaf1b5b9fe9',
    pass: 'cb8a85ec2f6883',
    port: 2525,
  }
};

const config = process.env.NODE_ENV === 'production' ? configs.production : configs.development;

const transport = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  auth: {
    user: config.user,
    pass: config.pass
  },
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3'
  }
});

module.exports = transport;
