import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const flush = (req: RequestWithBody, res: Response, next: NextFunction) => {
  let Node: Node = global.node;
  Node.flush();
  let resp = {
    received: true,
  };
  res.status(200).send(resp);
};

module.exports = flush;
