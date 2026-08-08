const app = require('./app');
const { PORT } = require('./config/env');

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` ScholarFlow AI Backend Engine is active            `);
  console.log(` Running on port: http://localhost:${PORT}          `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`====================================================`);
});

module.exports = server;
