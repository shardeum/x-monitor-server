const removed = (req, res, next) => {
  const nodeId = req.body.nodeId;
  let Node = global.node;
  Node.removed(nodeId);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = removed;