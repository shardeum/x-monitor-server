import {Response} from 'express';
import {RequestWithBody} from '../interface/interface';
import {Node} from '../class/node';
import {mainLogger} from '../class/logger';

const appVersions = (req: RequestWithBody, res: Response) => {
  try {
    let Node: Node = global.node;
    let appVersions = Node.getAppVersions();

    res.status(200).send(appVersions);
  } catch (e) {
    mainLogger.error(e);
  }
};

module.exports = appVersions;
