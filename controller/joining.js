const joining = (req, res, next) => {
  let publicKey = req.body.publicKey;
  let Node = global.node;
  Node.joining(publicKey);
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = joining;