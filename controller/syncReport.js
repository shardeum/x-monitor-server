const validateReport = require('../middleware/validateReport')
const syncReport = (req, res, next) => {
  const nodeId = req.body.nodeId
  const data = req.body.syncStatement
  const isReportValid = true
  if (nodeId && isReportValid) {
    let Node = global.node
    Node.syncReport(nodeId, data)
    let resp = {
      received: true
    }
    res.status(200).send(resp)
  } else {
    let resp = {
      received: false
    }
    res.status(200).send(resp)
  }
}

module.exports = syncReport
