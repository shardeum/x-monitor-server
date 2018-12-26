const report = (req, res, next) => {
  const nodeId = req.body.nodeId;
  let Node = global.node;
  let data = Node.report();
  res.status(200).send(data);
}

module.exports = report;