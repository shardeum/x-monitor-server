import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { RequestWithBody } from "../interface/interface";
const { generateNodeForTesting } = require("../class/mock");
const generatedNodes = generateNodeForTesting(10000);

const mock = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const count = req.query.count || 5000;
  if (count > 10000) return;
  const nodes = generatedNodes.slice(0, count);
  res.status(200).send(nodes);
};

module.exports = mock;
