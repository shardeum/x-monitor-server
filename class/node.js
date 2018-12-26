class Node {
  constructor() {
    this.nodes = {
      joining: {},
      syncing: {},
      active: {}
    }
  }

  joining(publicKey) {
    this.nodes.joining[publicKey] = true;
  }

  joined(publicKey, nodeId) {
    delete this.nodes.joining[publicKey];
    this.nodes.syncing[nodeId] = publicKey;
  }

  active(nodeId) {
    delete this.nodes.syncing[nodeId];
    this.nodes.active[nodeId] = {};
  }

  heartbeat(nodeId, data) {
    this.nodes.active[nodeId] = data;
  }

  report() {
    return this.nodes;
  }
}

module.exports = Node;