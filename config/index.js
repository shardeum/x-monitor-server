const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || '3000',
  statistics: {
    save: true,
    interval: 1
  }
}

module.exports = config;