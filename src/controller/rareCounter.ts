import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const rareCounter = (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  let Node: Node = global.node;
  let shouldAggregate: boolean = req.query.aggregate ? true : false;
  let rareCounter = Node.getRareEventCounters(shouldAggregate);
  res.status(200).send(rareCounter);
};

module.exports = rareCounter;
