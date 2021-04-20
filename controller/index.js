const joining = require('./joining');
const joined = require('./joined');
const active = require('./active');
const removed = require('./removed');
const heartbeat = require('./heartbeat');
const report = require('./report');
const flush = require('./flush');
const syncReport = require('./syncReport');
const getSyncReports = require('./getSyncReports');

const Controller = {
  joining,
  joined,
  active,
  removed,
  heartbeat,
  report,
  flush,
  syncReport,
  getSyncReports
}

module.exports = Controller;
