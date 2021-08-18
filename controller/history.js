const report = (req, res, next) => {
  let Node = global.node;
  let data = Node.getHistory();
  res.status(200).send(data);
}

module.exports = report;
