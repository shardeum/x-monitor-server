import { NextFunction, Response } from "express";
import { Node } from "../class/node";
import { NodeIpInfo, RequestWithBody, NodeInfoAppData } from "../interface/interface";

const joining = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const publicKey: string = req.body.publicKey;
  const nodeIpInfo: NodeIpInfo = req.body.nodeIpInfo;
  const appData: NodeInfoAppData = req.body.appData;
  let Node: Node = global.node;
  Node.joining(publicKey, nodeIpInfo, appData);
  let resp = {
    received: true,
  };
  res.status(200).send(resp);
};

module.exports = joining;
