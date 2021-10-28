const {generateNodeForTesting} = require('../build/src/class/mock')
const axios = require('axios')

const monitorServerIp = '127.0.0.1'
const monitorServerPort = 3000
const consensorCount = 1000
const heartbeatInterval = 30000

const nodes = generateNodeForTesting(consensorCount)
let counter = 0

async function sendHeartbeat() {
    const updatedNodes = nodes.map(n => {
        const data = {...n}
        data.cycleCounter = counter
        const nodeId = n.nodeId
        return {nodeId, data}
    })
    for (let report of updatedNodes) {
        const res = await axios.post(`http://${monitorServerIp}:${monitorServerPort}/api/heartbeat`, report)
        console.log(res.data)
    }
    counter += 1
}

setInterval(sendHeartbeat, heartbeatInterval)
