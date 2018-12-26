const joining = require('./joining');
const joined = require('./joined');
const active = require('./active');
const heartbeat = require('./heartbeat');

const Controller = {
  joining,
  joined,
  active,
  heartbeat
}

module.exports = Controller;