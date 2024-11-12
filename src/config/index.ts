import { join } from 'path';
require("dotenv").config();
let config = {
  env: process.env.NODE_ENV?.toLowerCase() || "release", // "debug"
  host: process.env.HOST || "127.0.0.1",
  port: process.env.PORT || "3000",
  statistics: {
    save: true,
    interval: 1,
  },
  allowBogon: process.env.NODE_ENV?.toLowerCase() === 'debug' ? true : false,
  removeCrashedNode: true,
  nodeCrashTimeout: 1000 * 60 * 2, // 2 min
  secret: process.env.SECRET,
  username: process.env.NAME,
  password: process.env.PASSWORD,
  restoreFromBackup: false,
  backup: {
    enabled: true,
    nodelist_path: join(__dirname, '../../', 'cold_nodelist.json'),
    networkStat_path: join(__dirname, '../../', 'cold_networkStat.json')
  },
  verboseLog: false
};

// should NOT log the secret or password
const { secret, password, ...safeConfig } = config;
console.log('monitor config', config)

export default config
