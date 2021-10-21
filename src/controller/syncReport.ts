import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";
const validateReport = require("../middleware/validateReport");

const syncReport = (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  const nodeId: string = req.body.nodeId;
  const data = req.body.syncStatement;
  const isReportValid = true;
  if (nodeId && isReportValid) {
    let Node = global.node;
    Node.syncReport(nodeId, data);
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

module.exports = syncReport;
