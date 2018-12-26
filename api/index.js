const express = require('express');
const router = express.Router();

const Controller = require('../controller');

router.get('/report', Controller.report);

router.post('/joining', Controller.joining);
router.post('/joined', Controller.joined);
router.post('/active', Controller.active);
router.post('/heartbeat', Controller.heartbeat);

module.exports = router;