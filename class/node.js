class Node {
  constructor() {
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.weight = 5
    this.avgApplied = 0
    this.activeLength = 0
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
    this.activeLength++
  }

  removed(nodeId) {
    delete this.nodes.active[nodeId];
    this.activeLength--
  }

  heartbeat(nodeId, data) {
    this.nodes.active[nodeId] = data
    this.totalTxInjected += data.txInjected
    this.totalTxRejected += data.txRejected
    this.totalTxExpired += data.txExpired
    // let partitionFactor
    // if (data.partitionsCovered === 0) {
    //   partitionFactor = 1
    // } else {
    //   partitionFactor = data.partitions / data.partitionsCovered 
    // }
    // this.avgApplied = Math.round((this.weight * this.avgApplied + (data.txApplied * partitionFactor / data.reportInterval)) / (this.weight + 1))
    this.avgApplied += (data.txInjected - data.txRejected - data.txExpired) / (this.activeLength || 1)
  }

  report() {
    return { 
      nodes: this.nodes,
      totalInjected: this.totalTxInjected,
      totalRejected: this.totalTxRejected,
      totalExpired: this.totalTxExpired,
      avgApplied: this.avgApplied
    }
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
