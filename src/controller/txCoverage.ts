import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const getTxCoverage = (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  const nodeId: string | undefined = req.body.nodeId;
  let Node : Node = global.node;
  let data = Node.getTxCoverage();
  res.status(200).send(data);
};

module.exports = getTxCoverage;
