/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config();

const PORT = process.env.PORT || 4042;
module.exports = {
  app: {
    appName: process.env.APP_NAME || 'Event-backend-API',
    environment: process.env.NODE_ENV || 'development',
    superSecret: process.env.SERVER_SECRET || 'Event-backend-API',
    baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
    port: PORT,
  },
  database: {
    mongodb: {
        url: process.env.DB_URL,
        test: process.env.DB_TEST_URL,
    },
  },
  api: {
    lang: 'en',
    api_key: process.env.API_KEY,
    prefix: '^/api/v[1-9]',
    versions: [1],
    pagination: {
      items_per_page: 10,
    },
  },
};
