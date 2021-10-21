import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const removed = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const nodeId: string | undefined = req.body.nodeId;
  let Node: Node = global.node;
  let removed = Node.getRemoved();
  res.status(200).send({ removed });
};

module.exports = removed;
