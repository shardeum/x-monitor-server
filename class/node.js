// const fs = require('fs')
// const path = require('path')
// const writeStream = fs.createWriteStream(path.join('.', 'node-reports.json'))

class Node {
  constructor () {
    this.totalTxInjected = 0
    this.totalTxRejected = 0
    this.totalTxExpired = 0
    this.totalProcessed = 0
    this.nodes = this._createEmptyNodelist()
  }

  _createEmptyNodelist () {
    return {
      joining: {},
      syncing: {},
      active: {}
    }
  }

  joining (publicKey, nodeIpInfo) {
    this.nodes.joining[publicKey] = { nodeIpInfo }
  }

  joined (publicKey, nodeId, nodeIpInfo) {
    delete this.nodes.joining[publicKey]
    this.nodes.syncing[nodeId] = { publicKey, nodeIpInfo }
  }

  active (nodeId) {
    delete this.nodes.syncing[nodeId]
    this.nodes.active[nodeId] = {}
  }

  removed (nodeId) {
    delete this.nodes.active[nodeId]
  }

  heartbeat (nodeId, data) {
    this.nodes.active[nodeId] = data
    this.nodes.active[nodeId].timestamp = Date.now()
    this.totalTxInjected += data.txInjected
    this.totalTxRejected += data.txRejected
    this.totalTxExpired += data.txExpired
    this.totalProcessed += data.txProcessed
    // this.avgApplied += (data.txInjected - data.txRejected - data.txExpired)
    // writeStream.write(JSON.stringify(this.nodes.active[nodeId], null, 2) + '\n')
  }

  report () {
    return {
      nodes: this.nodes,
      totalInjected: this.totalTxInjected,
      totalRejected: this.totalTxRejected,
      totalExpired: this.totalTxExpired,
      totalProcessed: this.totalProcessed,
      timestamp: Date.now()
    }
  }

  flush () {
    this.nodes = this._createEmptyNodelist()
    // this.totalTxInjected = 0
    // this.totalTxRejected = 0
    // this.totalTxExpired = 0
    // this.totalProcessed = 0
  }
}

module.exports = Node
