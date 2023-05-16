const validateReport = require("../middleware/validateReport");
const Logger = require("../class/logger");
import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const heartbeat = async (req: RequestWithBody, res: Response, next: NextFunction) => {
  try {
    const nodeId: string | undefined = req.body.nodeId;
    const data = req.body.data;
    const isReportValid = validateReport(data);
    if (!isReportValid)
      Logger.errorLogger.error("Report is invalid", nodeId, data);
    if (nodeId && isReportValid && data.nodeIpInfo && data.currentLoad) {
      let Node: Node = global.node;
      await Node.heartbeat(nodeId, data);
      let resp = {
        received: true,
      };
      res.status(200).send(resp);
    } else {
      let resp = {
        received: false,
      };
      res.status(400).send(resp);
    }
  } catch (e) {
    Logger.mainLogger.error(e)
      res.status(500).send('');
  }
};

module.exports = heartbeat;
