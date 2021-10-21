import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const active = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const nodeId: string | undefined = req.body.nodeId;
  let Node: Node = global.node;
  Node.active(nodeId);
  let resp = {
    received: true,
  };
  res.status(200).send(resp);
};

module.exports = active;
