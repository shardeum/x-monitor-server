const {generateNodeForTesting} = require('../build/src/class/mock')
const axios = require('axios')

const monitorServerIp = '208.110.82.50'
// const monitorServerIp = 'localhost'
const monitorServerPort = 3000
const consensorCount = 100
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
    console.log("Created reports to send.")
    for (let report of updatedNodes) {
        console.time('heartbeat')
        axios.post(`http://${monitorServerIp}:${monitorServerPort}/api/heartbeat`, report)
        console.timeEnd('heartbeat')
    }
    counter += 1
}

sendHeartbeat()

setInterval(sendHeartbeat, heartbeatInterval)
