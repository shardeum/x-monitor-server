const active = (req, res, next) => {
  const nodeId = req.body.nodeId;
  let Node = global.node;
  Node.active(nodeId);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = active;