let config = {
  env: process.env.NODE_ENV || "release", // "debug"
  host: process.env.HOST || "127.0.0.1",
  port: process.env.PORT || "3000",
  statistics: {
    save: true,
    interval: 1,
  },
  allowBogon: process.env.NODE_ENV === 'debug' ? true : false,
  removeCrashedNode: true,
  nodeCrashTimeout: 1000 * 60 * 2, // 2 min
  secret: 'Decentralization for everyone',
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'password'
};

console.log('monitor config', config)

export default config

