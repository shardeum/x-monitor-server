const joining = require('./joining');
const joined = require('./joined');
const active = require('./active');
const removed = require('./removed');
const rareCounter = require('./rareCounter');
const resetRareCounter = require('./resetRareCounter');
const getRemoved = require('./getRemoved');
const heartbeat = require('./heartbeat');
const report = require('./report');
const flush = require('./flush');
const syncReport = require('./syncReport');
const getSyncReports = require('./getSyncReports');
const getTxCoverage = require('./txCoverage');
const history = require('./history');
const getScaleReports = require('./getScaleReports');
const mock = require('./mock');
const countedEvents = require('./countedEvents');
const invalidIPs = require('./invalidIPs');

export const Controller = {
  joining,
  joined,
  active,
  removed,
  heartbeat,
  report,
  flush,
  syncReport,
  getSyncReports,
  getTxCoverage,
  history,
  getScaleReports,
  mock,
  getRemoved,
  rareCounter,
  resetRareCounter,
  countedEvents,
  invalidIPs
};
