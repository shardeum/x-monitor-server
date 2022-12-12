import {Response} from 'express';
import {MonitorCountedEvent, RequestWithBody} from '../interface/interface';
import {Node} from '../class/node';
import {mainLogger} from '../class/logger';

const countedEvents = (req: RequestWithBody, res: Response) => {
  try {
    let Node: Node = global.node;
    let countedEventsMap = Node.getCountedEvents();
    const countedEvents: MonitorCountedEvent[] = [];

    for (let eventCategories of countedEventsMap.values()) {
      for (let countedEvent of eventCategories.values()) {
        countedEvents.push(countedEvent)
      }
    }

    res.status(200).send(countedEvents);
  } catch (e) {
    mainLogger.error(e);
  }
};

module.exports = countedEvents;
