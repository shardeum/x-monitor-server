const express = require('express');
const router = express.Router();

const Controller = require('../controller');
const Middleware = require('../middleware');

router.get('/report', Controller.report);
router.get('/sync-report', Controller.getSyncReports);
router.get('/flush', Controller.flush);
router.get('/history', Controller.history);

router.post('/joining', Middleware.fieldExistance(['publicKey']), Controller.joining);
router.post('/joined', Middleware.fieldExistance(['publicKey', 'nodeId']), Controller.joined);
router.post('/active', Middleware.fieldExistance(['nodeId']), Controller.active);
router.post('/removed', Middleware.fieldExistance(['nodeId']), Controller.removed);
router.post('/heartbeat', Middleware.fieldExistance(['nodeId', 'data']), Controller.heartbeat);
router.post('/sync-statement', Middleware.fieldExistance(['nodeId', 'syncStatement']), Controller.syncReport);

module.exports = router;
