const validateReport = require("../middleware/validateReport");
const Logger = require("../class/logger");
import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const heartbeat = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const nodeId: string | undefined = req.body.nodeId;
  const data = req.body.data;
  const isReportValid = validateReport(data);
  if (!isReportValid)
    Logger.errorLogger.error("Report is invalid", nodeId, data);
  if (nodeId && isReportValid) {
    let Node: Node = global.node;
    Node.heartbeat(nodeId, data);
    let resp = {
      received: true,
    };
    res.status(200).send(resp);
  } else {
    let resp = {
      received: false,
    };
    res.status(200).send(resp);
  }
};

module.exports = heartbeat;
