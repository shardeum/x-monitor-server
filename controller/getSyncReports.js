const getSyncReports = (req, res, next) => {
  const nodeId = req.body.nodeId;
  let Node = global.node;
  let data = Node.getSyncReports();
  res.status(200).send(data);
}

module.exports = getSyncReports;
