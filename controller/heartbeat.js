const heartbeat = (req, res, next) => {
  const nodeId = req.body.nodeId;
  const data = req.body.data;
  let Node = global.node;
  Node.heartbeat(nodeId, data);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = heartbeat;