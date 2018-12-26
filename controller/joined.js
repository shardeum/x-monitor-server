const joined = (req, res, next) => {
  const publicKey = req.body.publicKey;
  const nodeId = req.body.nodeId;
  let Node = global.node;
  Node.joined(publicKey, nodeId);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = joined;