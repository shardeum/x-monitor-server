import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";

const resetRareCounter = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  let Node: Node = global.node;
  Node.resetRareCounters();
  res.status(200).send({success: true});
};

module.exports = resetRareCounter;
