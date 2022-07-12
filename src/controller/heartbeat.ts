const validateReport = require("../middleware/validateReport");
const Logger = require("../class/logger");
import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const heartbeat = (req: RequestWithBody, res: Response, next: NextFunction) => {
  try {
    const nodeId: string | undefined = req.body.nodeId;
    const data = req.body.data;
    const isReportValid = validateReport(data);
    if (!isReportValid)
      Logger.errorLogger.error("Report is invalid", nodeId, data);
    if (nodeId && isReportValid) {
      let Node: Node = global.node;
      Node.heartbeat(nodeId, data);
      let testing = true
      if(testing) {
        if(Math.random() > 0.5) throw new Error('thant')
      }
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
  } catch (e) {
    Logger.mainLogger.error(e)
  }
};

module.exports = heartbeat;
