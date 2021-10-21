import { NextFunction, Request, Response } from "express";
import { Node } from "../class/node";

const report = (req: Request, res: Response, next: NextFunction) => {
  const lastTimestamp = req.query.timestamp as string;
  console.log(req.query.timestamp);
  let Node: Node = global.node;
  let data;
  if (lastTimestamp) data = Node.report(Number(lastTimestamp));
  else data = Node.report(Number(lastTimestamp));
  res.status(200).send(data);
};

module.exports = report;
