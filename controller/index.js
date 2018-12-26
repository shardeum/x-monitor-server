const joining = require('./joining');
const joined = require('./joined');
const active = require('./active');
const heartbeat = require('./heartbeat');
const report = require('./report');

const Controller = {
  joining,
  joined,
  active,
  heartbeat,
  report
}

module.exports = Controller;