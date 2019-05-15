class Node {
  constructor() {
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
  }

  report() {
    return this.nodes;
  }
  
  flush() {
    this.nodes = this._createEmptyNodelist()
  }
}

module.exports = Node;
