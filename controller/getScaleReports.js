const getScaleReports = (req, res, next) => {
    let Node = global.node;
    let data = Node.getScaleReports();
    res.status(200).send(data);
  }
  
  module.exports = getScaleReports;
  