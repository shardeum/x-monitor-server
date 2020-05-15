const validateReport = require('../middleware/validateReport')
const heartbeat = (req, res, next) => {
  const nodeId = req.body.nodeId
  const data = req.body.data
  const isReportValid = validateReport(data)
  if (nodeId && isReportValid) {
    let Node = global.node
    Node.heartbeat(nodeId, data)
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

module.exports = heartbeat
