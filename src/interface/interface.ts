import {Request} from 'express';
import {Node} from '../class/node';

declare global {
  var node: Node;
}

export interface ErrorWithStatus extends Error {
  status: number | null | undefined;
}

export interface RequestWithBody extends Request {
  body: {
    nodeId: string | undefined;
    publicKey: string | undefined;
    data: ActiveReport | undefined;
    nodeIpInfo: NodeIpInfo | undefined;
    [key: string]: {} | undefined;
  };
}

export interface CrashNodes {
  nodeId: string;
  nodeIpInfo: NodeIpInfo;
}

export interface NodeList {
  joining: {
    [key: string]: JoinReport;
  };
  syncing: {
    [key: string]: SyncReport;
  };
  active: {
    [key: string]: ActiveReport;
  };
}

export interface Report {
  nodes: NodeList;
  totalInjected: number;
  totalRejected: number;
  totalExpired: number;
  totalProcessed: number;
  timestamp: number;
  avgTps: number;
  maxTps: number;
  rejectedTps: number;
}

export interface NodeIpInfo {
  externalIp: string;
  externalPort: number;
  internalIp: string;
  internalPort: number;
}

export interface JoinReport {
  nodeIpInfo: NodeIpInfo;
}

export interface SyncReport {
  publicKey: string;
  nodeId: string;
  nodeIpInfo: NodeIpInfo;
  timestamp: number;
}

export interface ActiveReport {
  nodeId: string;
  repairsStarted: number;
  repairsFinished: number;
  appState: string;
  cycleMarker: string;
  cycleCounter: number;
  nodelistHash: string;
  desiredNodes: number;
  lastScalingTypeWinner: string;
  lastScalingTypeRequested: string;
  txInjected: number;
  txApplied: number;
  txRejected: number;
  txExpired: number;
  txProcessed: number;
  reportInterval: number;
  nodeIpInfo: NodeIpInfo;
  txCoverage: any;
  partitionReport:
    | {}
    | {
        res: PartitionInfo[];
        cycleNumber: number;
      };
  globalSync: boolean;
  partitions: number;
  partitionsCovered: number;
  currentLoad: {
    networkLoad: number;
    nodeLoad: number;
  };
  queueLength: number;
  txTimeInQueue: number;
  timestamp: number;
  rareCounters: any;
  crashed: boolean;
  isLost: boolean;
  isRefuted: boolean;
  shardusVersion: string;
  countedEvents: CountedEvent[];
  appVersion: string;
}

export type CountedEvent = {
  eventCategory: string;
  eventName: string;
  eventCount: number;
  eventTimestamps: number[];
  eventMessages: string[];
};

// Map<eventCategory, Map<eventName, MonitorCountedEvent>>
export type MonitorCountedEventMap = Map<string, Map<string, MonitorCountedEvent>>

export type MonitorCountedEvent = {
  eventCategory: string;
  eventName: string;
  eventCount: number;
  instanceData: {
    [nodeId: string]: MonitorEventCountedInstanceData | undefined;
  };
  eventMessages: {
    [eventMessage: string]: number | undefined;
  }
}

type MonitorEventCountedInstanceData = {
  externalIp: string;
  externalPort: number;
  eventCount: number;
}



export interface PartitionInfo {
  i: number;
  h: string;
}
