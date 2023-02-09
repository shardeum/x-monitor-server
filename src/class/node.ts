import axios from 'axios';
import config from '../config';

const Logger = require('./logger');
const ProfilerModule = require('./profiler/profiler');

import {
  NodeList,
  Report,
  NodeIpInfo,
  ActiveReport,
  SyncReport,
  CrashNodes,
  CountedEvent,
  MonitorCountedEventMap,
} from '../interface/interface';
import { isBogonIP, isInvalidIP } from '../utils';

type TxCoverageData = {
  txId: string;
  count: number;
  timestamp: number;
};

export class Node {
  totalTxInjected: number;
  totalTxRejected: number;
  totalTxExpired: number;
  totalProcessed: number;
  avgTps: number;
  maxTps: number;
  rejectedTps: number;
  lastTotalProcessed: number;
  lastTotalTxRejected: number;
  reportInterval: number;
  nodes: NodeList;
  isTimerStarted: boolean;
  crashTimout: number;
  lostNodeIds: Map<string, boolean>;
  syncStatements: {};
  removedNodes: {};
  crashedNodes: {[key: string]: CrashNodes};
  history: {};
  counter: number;
  rareEventCounters = {};
  txCoverageMap: {[key: string]: TxCoverageData};
  txCoverageCounter: {[key: string]: number};
  countedEvents: MonitorCountedEventMap;
  bogonIpCount: any
  invalidIpCount: any

  constructor() {
    this.totalTxInjected = 0;
    this.totalTxRejected = 0;
    this.totalTxExpired = 0;
    this.totalProcessed = 0;
    this.avgTps = 0;
    this.maxTps = 0;
    this.rejectedTps = 0;
    this.lastTotalProcessed = 0;
    this.reportInterval = 1000;
    this.nodes = this._createEmptyNodelist();
    this.isTimerStarted = false;
    this.crashTimout = config.nodeCrashTimeout;
    this.lostNodeIds = new Map();
    this.syncStatements = {};
    this.removedNodes = {};
    this.crashedNodes = {};
    this.history = {};
    this.counter = 0;
    this.rareEventCounters = {};
    this.txCoverageMap = {};
    this.txCoverageCounter = {};
    this.countedEvents = new Map();
    this.bogonIpCount = {joining: 0, joined: 0, active: 0, heartbeat: 0}
    this.invalidIpCount = {joining: 0, joined: 0, active: 0, heartbeat: 0}

    setInterval(this.summarizeTxCoverage.bind(this), 10000);

    setInterval(this.updateRejectedTps.bind(this), this.reportInterval);

    setInterval(this.checkStandbyNodes.bind(this), 5000)
  }

  private _createEmptyNodelist(): NodeList {
    return {
      joining: {},
      syncing: {},
      active: {},
    };
  }

  checkStandbyNodes() {
    for (let pk in this.nodes.joining) {
      const nodeIpInfo: NodeIpInfo = this.nodes.joining[pk].nodeIpInfo;
      const url = `http://${nodeIpInfo.externalIp}:${nodeIpInfo.externalPort}/nodeinfo`;
      axios.get(url).then(res => {
        if (res.status !== 200) {
          Logger.mainLogger.warn(`Standby node ${nodeIpInfo.externalIp}:${nodeIpInfo.externalPort} is not online`)
          delete this.nodes.joining[pk];
        }
      }).catch(err => {
        Logger.mainLogger.warn(`Standby node ${nodeIpInfo.externalIp}:${nodeIpInfo.externalPort} is not online`)
        delete this.nodes.joining[pk];
      })
    }
  }
  joining(publicKey: string, nodeIpInfo: NodeIpInfo): void {
    if (config.allowBogon === false) {
      if (isBogonIP(nodeIpInfo.externalIp)) {
        this.bogonIpCount.joining++
        Logger.mainLogger.info(`Received bogon ip at joining report. public key: ${publicKey}, nodeIpInfo: ${JSON.stringify(nodeIpInfo)}`);
        return
      }
    } else {
      //even if not checking bogon still reject other invalid IPs that would be unusable
      if (isInvalidIP(nodeIpInfo.externalIp)) {
        this.invalidIpCount.joining++
        Logger.mainLogger.info(`Received invalid ip at joining report. public key: ${publicKey}, nodeIpInfo: ${JSON.stringify(nodeIpInfo)}`);
        return
      }
    }
    const existingStandbyNodePublicKey = this.getExistingStandbyNode(publicKey, nodeIpInfo);
    if (existingStandbyNodePublicKey) {
      delete this.nodes.joining[existingStandbyNodePublicKey];
      Logger.mainLogger.info(
          'Joining node is found in the standby list. Removing existing standby node'
      );
    }
    this.nodes.joining[publicKey] = {nodeIpInfo};

    const existingSyncingNode = this.getExistingSyncingNode('', nodeIpInfo);
    if (existingSyncingNode) {
      delete this.nodes.syncing[existingSyncingNode.nodeId];
      Logger.mainLogger.info(
        'Joining node is found in the syncing list. Removing existing syncing node.'
      );
    }
    const existingActiveNode = this.getExistingActiveNode('', nodeIpInfo);
    if (existingActiveNode) {
      delete this.nodes.active[existingActiveNode.nodeId];
      Logger.mainLogger.info(
        'Joining node is found in the active list. Removing existing active node.'
      );
    }
  }

  getExistingActiveNode(nodeId: string, nodeIpInfo: NodeIpInfo): ActiveReport {
    Logger.mainLogger.debug(
      'Checking existing active node.',
      nodeId,
      nodeIpInfo
    );
    try {
      if (this.nodes.active[nodeId]) {
        Logger.mainLogger.debug(
          'Found existing active node with same nodeId',
          nodeId
        );
        return this.nodes.active[nodeId];
      } else {
        for (const id in this.nodes.active) {
          const report = this.nodes.active[id];
          if (
            report.nodeIpInfo.externalIp === nodeIpInfo.externalIp &&
            report.nodeIpInfo.externalPort === nodeIpInfo.externalPort
          ) {
            return this.nodes.active[id];
          }
        }
      }
    } catch (e) {
      Logger.mainLogger.error('Error while checking active node', e);
    }
    Logger.mainLogger.debug('No existing active node found.');
    return;
  }

  getExistingSyncingNode(nodeId: string, nodeIpInfo: NodeIpInfo): SyncReport {
    Logger.mainLogger.debug(
      'Checking existing syncing node.',
      nodeId,
      nodeIpInfo
    );
    try {
      if (this.nodes.syncing[nodeId]) {
        Logger.mainLogger.debug(
          'Found existing syncing node with same nodeId',
          nodeId
        );
        return this.nodes.syncing[nodeId];
      } else {
        for (const id in this.nodes.syncing) {
          const report = this.nodes.syncing[id];
          if (
            report.nodeIpInfo.externalIp === nodeIpInfo.externalIp &&
            report.nodeIpInfo.externalPort === nodeIpInfo.externalPort
          ) {
            return this.nodes.syncing[id];
          }
        }
      }
    } catch (e) {
      Logger.mainLogger.error('Error while chcking syncing node', e);
    }
    Logger.mainLogger.debug('No existing syncing node found.');
    return;
  }

  getExistingStandbyNode(publicKey: string, nodeIpInfo: NodeIpInfo): string {
    Logger.mainLogger.debug(
        'Checking existing standby node.',
        publicKey,
        nodeIpInfo
    );
    try {
      if (this.nodes.joining[publicKey]) {
        Logger.mainLogger.debug(
            'Found existing standby node with same publicKey',
            publicKey
        );
        return publicKey;
      } else {
        for (const pk in this.nodes.joining) {
          const standbyNode = this.nodes.joining[pk];
          if (
              standbyNode.nodeIpInfo.externalIp === nodeIpInfo.externalIp &&
              standbyNode.nodeIpInfo.externalPort === nodeIpInfo.externalPort
          ) {
            return pk;
          }
        }
      }
    } catch (e) {
      Logger.mainLogger.error('Error while checking standby node', e);
    }
    Logger.mainLogger.debug('No existing standby node found.');
    return;
  }

  joined(publicKey: string, nodeId: string, nodeIpInfo: NodeIpInfo): void {
    try {
      if (config.allowBogon === false) {
        if (isBogonIP(nodeIpInfo.externalIp)) {
          this.bogonIpCount.joined++
          Logger.mainLogger.info(`Received bogon ip at joined report. public key: ${publicKey}, nodeId: ${nodeId}, nodeIpInfo: ${JSON.stringify(nodeIpInfo)}`);
          return
        }
      } else {
        //even if not checking bogon still reject other invalid IPs that would be unusable
        if (isInvalidIP(nodeIpInfo.externalIp)) {
          this.invalidIpCount.joined++
          Logger.mainLogger.info(`Received invalid ip at joined report. public key: ${publicKey}, nodeId: ${nodeId}, nodeIpInfo: ${JSON.stringify(nodeIpInfo)}`);
          return
        }
      }
      const existingSyncingNode = this.getExistingSyncingNode(
        nodeId,
        nodeIpInfo
      );
      const existingActiveNode = this.getExistingActiveNode(nodeId, nodeIpInfo);
      if (existingSyncingNode) {
        delete this.nodes.syncing[existingSyncingNode.nodeId];
        Logger.mainLogger.info(
          'Joined node is found in the syncing list. Removing existing syncing node.'
        );
      }
      if (existingActiveNode) {
        Logger.mainLogger.info(
          'Joined node is found in the active list. Comparing the timestamps...'
        );
        // checking if last heart beat of active node is sent within last x seconds (report interval)
        if (
          Date.now() - existingActiveNode.timestamp <
          1.5 * this.reportInterval
        ) {
          Logger.mainLogger.info(
            `This node ${existingActiveNode.nodeId} sent heartbeat recently. So, this joined message is neglected.`
          );
          return; // not likely that active node will re-join the network again in a report interval
        }
        Logger.mainLogger.info(
          `This node ${existingActiveNode.nodeId} does not sent heartbeat recently. So, this joined message is processed.`
        );
        delete this.nodes.active[existingActiveNode.nodeId];
      }
      this.nodes.syncing[nodeId] = {
        publicKey,
        nodeId,
        nodeIpInfo,
        timestamp: Date.now(),
      };
      if (!this.history[nodeId]) this.history[nodeId] = {};
      this.history[nodeId].joined = Date.now();
      this.history[nodeId].data = {
        nodeIpInfo,
        nodeId,
      };
      this.checkCrashedBefore(this.history[nodeId].data);
      if (this.nodes.joining[publicKey]) delete this.nodes.joining[publicKey];
      Logger.historyLogger.info(
        `joined ${nodeId} ${nodeIpInfo.externalIp} ${nodeIpInfo.externalPort} ${this.counter}`
      );
    } catch (e) {
      Logger.mainLogger.error(e);
    }
  }

  active(nodeId: string): void {
    try {
      delete this.nodes.syncing[nodeId];
      // this.nodes.active[nodeId] = {} as ActiveReport;
      this.history[nodeId].active = Date.now();
      const nodeData = this.history[nodeId].data;
      Logger.historyLogger.info(
        `active ${nodeId} ${nodeData.nodeIpInfo.externalIp} ${nodeData.nodeIpInfo.externalPort} ${this.counter}`
      );
    } catch (e) {
      Logger.mainLogger.error(e);
    }
  }

  checkCrashedBefore(data) {
    const foundInCrashed = Object.values(this.crashedNodes).find(
      node =>
        node.nodeIpInfo.externalIp === data.nodeIpInfo.externalIp &&
        node.nodeIpInfo.externalPort === data.nodeIpInfo.externalPort
    );
    if (foundInCrashed) {
      Logger.historyLogger.info(
        `Crashed node ${foundInCrashed.nodeId} has restarted and active.`
      );
      console.log(
        `Crashed node ${foundInCrashed.nodeId} has restarted and active.`
      );
      delete this.crashedNodes[foundInCrashed.nodeId];
      delete this.nodes.active[foundInCrashed.nodeId];
    }
  }

  removed(nodeId: string): void {
    try {
      const removedNode = this.nodes.active[nodeId];
      if (removedNode) {
        if (!this.removedNodes[this.counter]) {
          this.removedNodes[this.counter] = [];
        }
        this.removedNodes[this.counter].push({
          ip: removedNode.nodeIpInfo.externalIp,
          port: removedNode.nodeIpInfo.externalPort,
          nodeId,
          counter: this.counter,
        });
        if (this.history[nodeId]) this.history[nodeId].removed = Date.now();
        Logger.historyLogger.info(
          `removed ${nodeId} ${removedNode.nodeIpInfo.externalIp} ${removedNode.nodeIpInfo.externalPort} ${this.counter}`
        );
      }
      delete this.nodes.active[nodeId];
      // clean old removed nodes to prevent memory leak
      for (let counter in this.removedNodes) {
        if (parseInt(counter) + 5 < this.counter) {
          delete this.removedNodes[counter];
        }
      }
    } catch (e) {
      Logger.mainLogger.error(e);
    }
  }

  syncReport(nodeId, syncStatement) {
    this.syncStatements[nodeId] = syncStatement;
  }

  processTxCoverage(txCoverage) {
    for (const txId in txCoverage) {
      if (this.txCoverageMap[txId]) {
        this.txCoverageMap[txId].count += 1;
        this.txCoverageMap[txId].timestamp = Date.now();
      } else {
        this.txCoverageMap[txId] = {
          txId: String(txId),
          count: 1,
          timestamp: Date.now(),
        } as TxCoverageData;
      }
    }
  }

  summarizeTxCoverage() {
    let now = Date.now();
    // process txs which are 1 cycle old
    let readyTxs: TxCoverageData[] = Object.values(this.txCoverageMap).filter(
      (data: TxCoverageData) => now - data.timestamp > 60000
    );

    for (let tx of readyTxs) {
      if (this.txCoverageCounter[tx.count]) {
        this.txCoverageCounter[String(tx.count)] += 1;
      } else {
        this.txCoverageCounter[String(tx.count)] = 1;
      }
      delete this.txCoverageMap[tx.txId];
    }
  }

  getTxCoverage() {
    return {
      txCoverageCounter: this.txCoverageCounter,
    };
  }

  heartbeat(nodeId: string, data: ActiveReport): void {
    try {
      if (config.allowBogon === false) {
        if (isBogonIP(data.nodeIpInfo.externalIp)) {
          this.bogonIpCount.heartbeat++
          Logger.mainLogger.info(`Received bogon ip at heartbeat data. nodeId: ${nodeId}, nodeIpInfo: ${JSON.stringify(data.nodeIpInfo.externalIp)}`);
          return
        }
      } else {
        //even if not checking bogon still reject other invalid IPs that would be unusable
        if (isInvalidIP(data.nodeIpInfo.externalIp)) {
          this.invalidIpCount.heartbeat++
          Logger.mainLogger.info(`Received invalid ip at heartbeat data. nodeId: ${nodeId}, nodeIpInfo: ${JSON.stringify(data.nodeIpInfo.externalIp)}`);
          return
        }
      }
    } catch(e) {
      Logger.mainLogger.error(
        `Unable to check bogon or invalid ip`
      );
    }
    ProfilerModule.profilerInstance.profileSectionStart('heartbeat');
    if (this.nodes.syncing[nodeId]) {
      Logger.mainLogger.debug(
        `Found heart beating node ${nodeId} in syncing list. Removing it from syncing list.`
      );
      delete this.nodes.syncing[nodeId];
    }
    this.nodes.active[nodeId] = data;
    delete this.nodes.active[nodeId].txCoverage;
    this.nodes.active[nodeId].nodeId = nodeId;
    this.nodes.active[nodeId].timestamp = Date.now();
    this.nodes.active[nodeId].crashed = false;
    if (this.history[nodeId]) {
      this.history[nodeId].heartbeat = Date.now();
    }
    if (data.isLost) {
      if (!this.lostNodeIds.get(nodeId)) {
        Logger.historyLogger.info(
          `NODE LOST, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`
        );
      }
      this.lostNodeIds.set(nodeId, true);
    }
    if (data.isRefuted) {
      if (this.lostNodeIds.has(nodeId)) {
        this.lostNodeIds.delete(nodeId);
        Logger.historyLogger.info(
          `NODE REFUTED, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`
        );
      }
    }

    if (data.rareCounters && Object.keys(data.rareCounters).length > 0) {
      this.rareEventCounters[nodeId] = JSON.parse(
        JSON.stringify(data.rareCounters)
      ); // deep clone rare
      // counters so that later it can be deleted from report
    }
    this.nodes.active[nodeId].isLost = this.lostNodeIds.get(nodeId);

    if (this.reportInterval !== data.reportInterval) {
      this.reportInterval = data.reportInterval;
    }
    this.totalTxInjected += data.txInjected;
    this.totalTxRejected += data.txRejected;
    this.totalTxExpired += data.txExpired;
    this.totalProcessed += data.txProcessed;

    this.countedEvents = this.aggregateMonitorCountedEvents(
      this.countedEvents, data.countedEvents, this.nodes.active[nodeId]);

    if (this.counter < data.cycleCounter) this.counter = data.cycleCounter;

    if (!this.isTimerStarted) {
      setTimeout(() => {
        this.updateAvgAndMaxTps();
      }, this.reportInterval);
      this.isTimerStarted = true;
    }

    // decouple rareCounters from report to avoid large report size
    delete this.nodes.active[nodeId].rareCounters;
    ProfilerModule.profilerInstance.profileSectionEnd('heartbeat');
  }

  /**
   * Aggregates the incoming counted events and updates the MonitorCountedEventMap in place and returns it
   * @param currentCountedEvents
   * @param countedEvents
   * @param nodeId
   * @returns
   */
  private aggregateMonitorCountedEvents(currentCountedEvents: MonitorCountedEventMap , countedEvents: CountedEvent[], node: ActiveReport): MonitorCountedEventMap {
    const {nodeId, nodeIpInfo: {externalIp, externalPort}} = node;

    countedEvents.forEach(({eventCategory, eventName, eventCount, eventMessages}) => {
      if (!currentCountedEvents.has(eventCategory)) {
        currentCountedEvents.set(eventCategory, new Map());
      }

      const eventCategoryMap = currentCountedEvents.get(eventCategory)
      if (!eventCategoryMap.has(eventName)) {
        eventCategoryMap.set(eventName, {
          eventCategory: eventCategory,
          eventName: eventName,
          eventCount: 0,
          instanceData: {},
          eventMessages: {}
        });
      }

      const currentMonitorCountedEvent = currentCountedEvents.get(eventCategory).get(eventName);
      currentMonitorCountedEvent.eventCount += eventCount;

      if (currentMonitorCountedEvent.instanceData[nodeId] === undefined) {
        currentMonitorCountedEvent.instanceData[nodeId] = {
          eventCount: 0,
          externalIp,
          externalPort
        }
      }
      currentMonitorCountedEvent.instanceData[nodeId].eventCount += eventCount;

      eventMessages.forEach(eventMessage => {
        const messageCount = currentMonitorCountedEvent.eventMessages[eventMessage] ?? 0;
        currentMonitorCountedEvent.eventMessages[eventMessage] = messageCount + 1;
      });
    })

    return currentCountedEvents;
  }

  updateAvgAndMaxTps() {
    ProfilerModule.profilerInstance.profileSectionStart('updateAvgAndMaxTps');
    let diffRatio = 0;
    if (Object.keys(this.nodes.active).length === 0) return;
    const newAvgTps = Math.round(
      (this.totalProcessed - this.lastTotalProcessed) /
        (this.reportInterval / 1000)
    );
    if (this.avgTps > 0) diffRatio = (newAvgTps - this.avgTps) / this.avgTps;
    if (diffRatio < 1.5 || diffRatio > 0.5) {
      if (newAvgTps > this.maxTps) {
        this.maxTps = newAvgTps;
      }
    }
    this.avgTps = newAvgTps;
    this.lastTotalProcessed = this.totalProcessed;
    this.checkDeadOrAlive();
    setTimeout(() => {
      this.updateAvgAndMaxTps();
    }, this.reportInterval);
    ProfilerModule.profilerInstance.profileSectionEnd('updateAvgAndMaxTps');
  }

  updateRejectedTps() {
    ProfilerModule.profilerInstance.profileSectionStart('updateRejectedTps');
    if (Object.keys(this.nodes.active).length === 0) {
      this.rejectedTps = 0;
    }

    const rejectedTps = Math.round(
      (this.totalTxRejected - this.lastTotalTxRejected) /
        (this.reportInterval / 1000)
    );
    this.rejectedTps = rejectedTps;

    this.lastTotalTxRejected = this.totalTxRejected;

    ProfilerModule.profilerInstance.profileSectionEnd('updateRejectedTps');
  }

  checkDeadOrAlive() {
    ProfilerModule.profilerInstance.profileSectionStart('checkDeadOrAlive');
    for (const nodeId in this.nodes.active) {
      if (this.nodes.active[nodeId].timestamp < Date.now() - this.crashTimout) {
        const data = this.nodes.active[nodeId];
        this.nodes.active[nodeId].crashed = true;
        this.history[nodeId].crashed = this.nodes.active[nodeId].timestamp;
        if (!this.crashedNodes[nodeId]) {
          this.crashedNodes[nodeId] = data;
          Logger.historyLogger.info(
            `dead ${nodeId} ${data.nodeIpInfo.externalIp} ${data.nodeIpInfo.externalPort} ${this.counter}`
          );
        }
        if (config.removeCrashedNode) {
          Logger.historyLogger.info(
            `dead ${nodeId} ${data.nodeIpInfo.externalIp} ${data.nodeIpInfo.externalPort} ${this.counter} is removed from monitor`
          );
          delete this.nodes.active[nodeId]
        }
      } else {
        this.nodes.active[nodeId].crashed = false;
      }
    }
    ProfilerModule.profilerInstance.profileSectionEnd('checkDeadOrAlive');
  }

  getHistory() {
    return this.history;
  }

  getRemoved() {
    const start = this.counter >= 3 ? this.counter - 3 : 0;
    const end = this.counter;
    let recentRemovedNodes = [];
    for (let i = start; i <= end; i++) {
      let nodes = this.removedNodes[i];
      if (nodes && nodes.length > 0)
        recentRemovedNodes = recentRemovedNodes.concat(nodes);
    }
    return recentRemovedNodes;
  }

  getRandomNode() {
    if (Object.keys(this.nodes.active).length > 0) {
      let nodes = Object.values(this.nodes.active);
      let activeNodes = nodes.filter(node => node.crashed === false);
      let index = Math.floor(Math.random() * activeNodes.length);
      return activeNodes[index];
    } else if (Object.keys(this.nodes.syncing).length > 0) {
      return Object.values(this.nodes.syncing)[0];
    } else if (Object.keys(this.nodes.joining).length > 0) {
      return Object.values(this.nodes.joining)[0];
    }
  }

  getCountedEvents() {
    return this.countedEvents;
  }

  getInvalidIps() {
    return {bogon: this.bogonIpCount, invalid: this.invalidIpCount}
  }

  resetRareCounters() {
    this.rareEventCounters = {};
    const responses = [];
    for (const nodeId in this.nodes.active) {
      try {
        const nodeIpInfo = this.nodes.active[nodeId].nodeIpInfo;
        axios.get(
          `httP://${nodeIpInfo.externalIp}:${nodeIpInfo.externalPort}/rare-counts-reset`
        );
      } catch (e) {
        Logger.errorLogger.error(
          'Unable to reset rare counters for',
          nodeId,
          e
        );
      }
    }
  }

  getRareEventCounters(shouldAggregate) {
    let str = '';
    if (shouldAggregate) {
      const aggregatedCounter = {};
      for (const nodeId in this.rareEventCounters) {
        const counterMap = this.rareEventCounters[nodeId];
        for (const key in counterMap) {
          if (aggregatedCounter[key])
            aggregatedCounter[key].count += counterMap[key].count;
          else
            aggregatedCounter[key] = {
              count: counterMap[key].count,
              subCounters: {},
            };
          const subCounterMap = counterMap[key].subCounters;
          for (const key2 in subCounterMap) {
            if (aggregatedCounter[key].subCounters[key2])
              aggregatedCounter[key].subCounters[key2].count +=
                subCounterMap[key2].count;
            else
              aggregatedCounter[key].subCounters[key2] = {
                count: subCounterMap[key2].count,
                subCounters: {},
              };
          }
        }
      }
      return aggregatedCounter;
    } else {
      for (const nodeId in this.rareEventCounters) {
        const node = this.nodes.active[nodeId];
        if (!node) continue;
        str += `<p><a target="_blank" href="/log?ip=${node.nodeIpInfo.externalIp}&port=${node.nodeIpInfo.externalPort}">${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}</a></p>`;
        const counterMap = this.rareEventCounters[nodeId];
        for (const key in counterMap) {
          str += `<p>&emsp; ${key} &emsp; ${counterMap[key].count}</p>`;
          const subCounterMap = counterMap[key].subCounters;
          for (const key2 in subCounterMap) {
            str += `<p>&emsp; &emsp; ${key2} &emsp; ${subCounterMap[key2].count}</p>`;
          }
        }
      }
    }
    return str;
  }

  report(lastTimestamp?: number): Report {
    ProfilerModule.profilerInstance.profileSectionStart('GET_report');

    if (lastTimestamp) {
      const updatedNodes = {};
      for (const nodeId in this.nodes.active) {
        if (!this.nodes.active[nodeId].nodeIpInfo) continue;
        if (this.nodes.active[nodeId].timestamp > lastTimestamp) {
          updatedNodes[nodeId] = this.nodes.active[nodeId];
        }
      }
      for (const nodeId in this.crashedNodes) {
        updatedNodes[nodeId] = this.crashedNodes[nodeId];
      }
      return {
        nodes: {
          active: updatedNodes,
          syncing: this.nodes.syncing,
          joining: this.nodes.joining,
        },
        totalInjected: this.totalTxInjected,
        totalRejected: this.totalTxRejected,
        totalExpired: this.totalTxExpired,
        totalProcessed: this.totalProcessed,
        avgTps: this.avgTps,
        maxTps: this.maxTps,
        rejectedTps: this.rejectedTps,
        timestamp: Date.now(),
      };
    } else {
      ProfilerModule.profilerInstance.profileSectionEnd('GET_report');
      return {
        nodes: this.nodes,
        totalInjected: this.totalTxInjected,
        totalRejected: this.totalTxRejected,
        totalExpired: this.totalTxExpired,
        totalProcessed: this.totalProcessed,
        avgTps: this.avgTps,
        maxTps: this.maxTps,
        rejectedTps: this.rejectedTps,
        timestamp: Date.now(),
      };
    }
  }

  getSyncReports() {
    return this.syncStatements;
  }

  getScaleReports() {
    const scaleReports = [];
    for (const nodeId in this.nodes.active) {
      const data = this.nodes.active[nodeId] as ActiveReport;
      scaleReports.push({
        nodeId,
        ip: data.nodeIpInfo.externalIp,
        port: data.nodeIpInfo.externalPort,
        lastScalingTypeWinner: data.lastScalingTypeWinner
          ? data.lastScalingTypeWinner
          : null,
        lastScalingTypeRequested: data.lastScalingTypeRequested
          ? data.lastScalingTypeRequested
          : null,
      });
    }
    return scaleReports;
  }

  getActiveList() {
    return Object.values(this.nodes.active);
  }

  flush() {
    console.log('Flushing report');
    this.nodes = this._createEmptyNodelist();
    this.totalTxInjected = 0;
    this.totalTxRejected = 0;
    this.totalTxExpired = 0;
    this.totalProcessed = 0;
    this.avgTps = 0;
    this.maxTps = 0;
    this.lastTotalProcessed = 0;
  }
}
