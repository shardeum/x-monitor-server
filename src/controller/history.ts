import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";
const Logger = require("../class/logger");

const history = (req: RequestWithBody, res: Response, next: NextFunction) => {
  try {
    let Node: Node = global.node;
    let data = Node.getHistory();
    res.status(200).send(data);
  } catch (e) {
    Logger.mainLogger.error(e)
  }
};

module.exports = history;
