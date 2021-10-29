const joining = require("./joining");
const joined = require("./joined");
const active = require("./active");
const removed = require("./removed");
const rareCounter = require("./rareCounter");
const resetRareCounter = require("./resetRareCounter");
const getRemoved = require("./getRemoved");
const heartbeat = require("./heartbeat");
const report = require("./report");
const flush = require("./flush");
const syncReport = require("./syncReport");
const getSyncReports = require("./getSyncReports");
const history = require("./history");
const getScaleReports = require("./getScaleReports");
const mock = require("./mock");

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
  history,
  getScaleReports,
  mock,
  getRemoved,
  rareCounter,
  resetRareCounter,
};
