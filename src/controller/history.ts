import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const history = (req: RequestWithBody, res: Response, next: NextFunction) => {
  let Node: Node = global.node;
  let data = Node.getHistory();
  res.status(200).send(data);
};

module.exports = history;
