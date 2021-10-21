const express = require("express");
const router = express.Router();

import { Controller } from "../controller";
import { Middleware } from "../middleware";

router.get("/report", Controller.report);
router.get("/sync-report", Controller.getSyncReports);
router.get("/scale-report", Controller.getScaleReports);
router.get("/removed", Controller.getRemoved);
router.get("/flush", Controller.flush);
router.get("/history", Controller.history);
router.get("/rare-counter", Controller.rareCounter);
router.get("/mock", Controller.mock);

router.post(
  "/joining",
  Middleware.fieldExistance(["publicKey"]),
  Controller.joining
);
router.post(
  "/joined",
  Middleware.fieldExistance(["publicKey", "nodeId"]),
  Controller.joined
);
router.post(
  "/active",
  Middleware.fieldExistance(["nodeId"]),
  Controller.active
);
router.post(
  "/removed",
  Middleware.fieldExistance(["nodeId"]),
  Controller.removed
);
router.post(
  "/heartbeat",
  Middleware.fieldExistance(["nodeId", "data"]),
  Controller.heartbeat
);
router.post(
  "/sync-statement",
  Middleware.fieldExistance(["nodeId", "syncStatement"]),
  Controller.syncReport
);

module.exports = router;
