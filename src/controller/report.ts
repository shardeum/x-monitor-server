import {NextFunction, Request, Response} from 'express';
import {Node} from '../class/node';

const report = (req: Request, res: Response, next: NextFunction) => {
  const lastTimestamp = req.query.timestamp as string;
  const node: Node = global.node;

  const report = node.report(Number(lastTimestamp));

  res.status(200).send(report);
};

module.exports = report;
