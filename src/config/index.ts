let config = {
  env: process.env.NODE_ENV || "production",
  host: process.env.HOST || "127.0.0.1",
  port: process.env.PORT || "3000",
  statistics: {
    save: true,
    interval: 1,
  },
  secret: 'Decentralization for everyone',
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'password'
};

export default config

