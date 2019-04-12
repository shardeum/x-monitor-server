const joined = (req, res, next) => {
  const publicKey = req.body.publicKey;
  const nodeId = req.body.nodeId;
  const nodeIpInfo = req.body.nodeIpInfo;
  let Node = global.node;
  Node.joined(publicKey, nodeId, nodeIpInfo);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = joined;