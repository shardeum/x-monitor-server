const joining = (req, res, next) => {
  const publicKey = req.body.publicKey;
  const nodeIpInfo = req.body.nodeIpInfo;
  let Node = global.node;
  Node.joining(publicKey, nodeIpInfo);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = joining;