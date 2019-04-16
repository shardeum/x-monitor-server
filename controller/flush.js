const flush = (req, res, next) => {
  let Node = global.node;
  Node.flush();
  let resp = {
    received: true
  }
  res.status(200).send(resp);
}

module.exports = flush;
