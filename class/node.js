let Logger = require('./logger')

class Node {
    constructor() {
        this.totalTxInjected = 0
        this.totalTxRejected = 0
        this.totalTxExpired = 0
        this.totalProcessed = 0
        this.avgTps = 0
        this.maxTps = 0
        this.lastTotalProcessed = 0
        this.reportInterval = 1000
        this.nodes = this._createEmptyNodelist()
        this.isTimerStarted = false
        this.crashTimout = 30000
        this.lostNodeIds = new Map()
        this.syncStatements = {}
        this.removedNodes = []
        this.crashedNodes = {}
        this.history = {}
    }

    _createEmptyNodelist() {
        return {
            joining: {},
            syncing: {},
            active: {}
        }
    }

    joining(publicKey, nodeIpInfo) {
        this.nodes.joining[publicKey] = {nodeIpInfo}
    }

    joined(publicKey, nodeId, nodeIpInfo) {
        delete this.nodes.joining[publicKey]
        this.nodes.syncing[nodeId] = {publicKey, nodeIpInfo, timestamp: Date.now()}
        if (!this.history[nodeId]) this.history[nodeId] = {}
        this.history[nodeId].joined = Date.now()
        this.history[nodeId].data = {
            nodeIpInfo,
            nodeId
        }
        Logger.historyLogger.info(`NODE JOINED, NodeId: ${nodeId}, Ip: ${nodeIpInfo.externalIp}, Port: ${nodeIpInfo.externalPort}`)
    }

    active(nodeId) {
        delete this.nodes.syncing[nodeId]
        this.nodes.active[nodeId] = {}
        this.history[nodeId].active = Date.now()
        const nodeData = this.history[nodeId].data
        Logger.historyLogger.info(`NODE ACTIVE, NodeId: ${nodeId}, Ip: ${nodeData.nodeIpInfo.externalIp}, Port: ${nodeData.nodeIpInfo.externalPort}`)
    }

    removed(nodeId) {
        let removedNode = this.nodes.active[nodeId]
        if (removedNode) {
            this.removedNodes.push({
                ip: removedNode.nodeIpInfo.externalIp,
                port: removedNode.nodeIpInfo.externalPort,
                nodeId
            })
            if (this.history[nodeId]) this.history[nodeId].removed = Date.now()
            Logger.historyLogger.info(`NODE REMOVED, NodeId: ${nodeId}, Ip: ${removedNode.nodeIpInfo.externalIp}, Port: ${removedNode.nodeIpInfo.externalPort}`)
        }
        delete this.nodes.active[nodeId]
    }

    syncReport(nodeId, syncStatement) {
        this.syncStatements[nodeId] = syncStatement
    }

    heartbeat(nodeId, data) {
        // Logger.historyLogger.info(`NODE HEARTBEAT, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`)
        // Logger.mainLogger.info(`NODE HEARTBEAT, NodeId: ${nodeId}, ${JSON.stringify(data)}`)
        this.nodes.active[nodeId] = data
        this.nodes.active[nodeId].timestamp = Date.now()
        this.nodes.active[nodeId].crashed = false
        if (this.history[nodeId]) {
            this.history[nodeId].heartbeat = Date.now()
        }
        if (data.isLost) {
            if(!this.lostNodeIds.get(nodeId)) {
                Logger.historyLogger.info(`NODE LOST, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`)
            }
            this.lostNodeIds.set(nodeId, true)
        }
        if (data.isRefuted) {
            if (this.lostNodeIds.has(nodeId)) {
                this.lostNodeIds.delete(nodeId)
                Logger.historyLogger.info(`NODE REFUTED, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`)
            }
        }
        this.nodes.active[nodeId].isLost = this.lostNodeIds.get(nodeId)

        if (this.reportInterval !== data.reportInterval) {
            this.reportInterval = data.reportInterval
        }
        this.totalTxInjected += data.txInjected
        this.totalTxRejected += data.txRejected
        this.totalTxExpired += data.txExpired
        this.totalProcessed += data.txProcessed

        if (!this.isTimerStarted) {
            setTimeout(() => {
                this.updateAvgAndMaxTps()
            }, this.reportInterval)
            this.isTimerStarted = true
        }

        // this.avgApplied += (data.txInjected - data.txRejected - data.txExpired)
        // writeStream.write(JSON.stringify(this.nodes.active[nodeId], null, 2) + '\n')
    }

    updateAvgAndMaxTps() {
        let diffRatio = 0
        if (Object.keys(this.nodes.active).length === 0) return
        let newAvgTps = Math.round((this.totalProcessed - this.lastTotalProcessed) / (this.reportInterval / 1000))
        if (this.avgTps > 0) diffRatio = (newAvgTps - this.avgTps) / this.avgTps
        if ((diffRatio < 1.5) || (diffRatio > 0.5)) {
            if (newAvgTps > this.maxTps) {
                this.maxTps = newAvgTps
            }
        }
        this.avgTps = newAvgTps
        this.lastTotalProcessed = this.totalProcessed
        this.checkDeadOrAlive()
        setTimeout(() => {
            this.updateAvgAndMaxTps()
        }, this.reportInterval)
    }

    checkDeadOrAlive() {
        for (let nodeId in this.nodes.active) {
            if (this.nodes.active[nodeId].timestamp < Date.now() - this.crashTimout) {
                this.nodes.active[nodeId].crashed = true
                this.history[nodeId].crashed = this.nodes.active[nodeId].timestamp
                if (!this.crashedNodes[nodeId]) {
                    let data = this.nodes.active[nodeId]
                    this.crashedNodes[nodeId] = data
                    Logger.historyLogger.info(`NODE DEAD, NodeId: ${nodeId}, Ip: ${data.nodeIpInfo.externalIp}, Port: ${data.nodeIpInfo.externalPort}`)
                }
            } else {
                this.nodes.active[nodeId].crashed = false
            }
        }
    }

    getHistory() {
        return this.history
    }

    report() {
        return {
            nodes: this.nodes,
            totalInjected: this.totalTxInjected,
            totalRejected: this.totalTxRejected,
            totalExpired: this.totalTxExpired,
            totalProcessed: this.totalProcessed,
            avgTps: this.avgTps,
            maxTps: this.maxTps,
            timestamp: Date.now()
        }
    }

    getSyncReports() {
        return this.syncStatements
    }

    flush() {
        console.log('Flushing report')
        this.nodes = this._createEmptyNodelist()
        this.totalTxInjected = 0
        this.totalTxRejected = 0
        this.totalTxExpired = 0
        this.totalProcessed = 0
        this.avgTps = 0
        this.maxTps = 0
        this.lastTotalProcessed = 0
    }
}

module.exports = Node
