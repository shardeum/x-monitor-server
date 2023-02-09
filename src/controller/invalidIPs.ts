import {Response} from 'express';
import {MonitorCountedEvent, RequestWithBody} from '../interface/interface';
import {Node} from '../class/node';
import {mainLogger} from '../class/logger';

const invalidIps = (req: RequestWithBody, res: Response) => {
  try {
    let Node: Node = global.node;
    let invalidIps = Node.getInvalidIps();
    res.status(200).send(invalidIps);
  } catch (e) {
    mainLogger.error(e);
  }
};

module.exports = invalidIps;