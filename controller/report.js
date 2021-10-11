const report = (req, res, next) => {
    const lastTimestamp = req.query.timestamp
  let Node = global.node;
  let data = Node.report(lastTimestamp);
  res.status(200).send(data);
}

module.exports = report;
