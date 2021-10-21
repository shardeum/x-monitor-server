import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const removed = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const nodeId: string = req.body.nodeId;
  let Node: Node = global.node;
  Node.removed(nodeId);
  let resp = {
    received: true,
  };
  res.status(200).send(resp);
};

module.exports = removed;
