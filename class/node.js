class Node {
  constructor() {
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.weight = 5
    this.avgApplied = 0
    this.nodes = this._createEmptyNodelist()
  }

  _createEmptyNodelist() {
    return {
      joining: {},
      syncing: {},
      active: {}
    }
  }

  joining(publicKey, nodeIpInfo) {
    this.nodes.joining[publicKey] = { nodeIpInfo };
  }

  joined(publicKey, nodeId, nodeIpInfo) {
    delete this.nodes.joining[publicKey];
    this.nodes.syncing[nodeId] = { publicKey, nodeIpInfo };
  }

  active(nodeId) {
    delete this.nodes.syncing[nodeId];
    this.nodes.active[nodeId] = {};
  }

  removed(nodeId) {
    delete this.nodes.active[nodeId];
  }

  heartbeat(nodeId, data) {
    this.nodes.active[nodeId] = data;
    this.totalTxInjected += data.txInjected
    this.totalTxRejected += data.txRejected
    this.totalTxExpired += data.txExpired
    this.avgApplied = Math.round((this.weight * this.avgApplied + (data.txApplied / data.reportInterval)) / (this.weight + 1))
  }

  report() {
    return { 
      nodes: this.nodes,
      totalInjected: this.totalTxInjected,
      totalRejected: this.totalTxRejected,
      totalExpired: this.totalTxExpired,
      avgApplied: this.avgApplied
    };
  }
  
  flush() {
    this.nodes = this._createEmptyNodelist()
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.avgApplied = 0
  }
}

module.exports = Node;
