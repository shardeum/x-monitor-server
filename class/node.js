let Logger = require('./logger')
let ProfilerModule = require('./profiler/profiler')

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
        this.crashTimout = 60000
        this.lostNodeIds = new Map()
        this.syncStatements = {}
        this.removedNodes = []
        this.crashedNodes = {}
        this.history = {}
        this.counter = 0
        this.rareEventCounters = {}
    }

    _createEmptyNodelist() {
        return {
            joining: {},
            syncing: {},
            active: {}
        }
    }

    joining(publicKey, nodeIpInfo) {
        this.nodes.joining[publicKey] = { nodeIpInfo }
    }

    getExistingActiveNode(nodeId, nodeIpInfo) {
        Logger.mainLogger.debug("Checking existing node.", nodeId, nodeIpInfo)
        try {
            if (this.nodes.active[nodeId]) {
                Logger.mainLogger.debug("Found existing active node with same nodeId", nodeId)
                return this.nodes.active[nodeId]
            }  else {
                for (let id in this.nodes.active) {
                    let report = this.nodes.active[id]
                    if (report.nodeIpInfo.externalIp === nodeIpInfo.externalIp && report.nodeIpInfo.externalPort === nodeIpInfo.externalPort) {
                        return this.nodes.active[id]
                    }
                }
            }
        } catch(e) {
           Logger.mainLogger.error('Error while checking active node', e)
        }
        Logger.mainLogger.debug("No existing active node found.")
        return
    }

    getExistingSyncingNode(nodeId, nodeIpInfo) {
        Logger.mainLogger.debug("Checking existing syncing node.", nodeId, nodeIpInfo)
        try {
            if (this.nodes.syncing[nodeId]) {
                Logger.mainLogger.debug("Found existing syncing node with same nodeId", nodeId)
                return this.nodes.syncing[nodeId]
            }  else {
                for (let id in this.nodes.syncing) {
                    let report = this.nodes.syncing[id]
                    if (report.nodeIpInfo.externalIp === nodeIpInfo.externalIp && report.nodeIpInfo.externalPort === nodeIpInfo.externalPort) {
                        return this.nodes.syncing[id]
                    }
                }
            }
        } catch(e) {
            Logger.mainLogger.error('Error while chcking syncing node', e)
        }
        Logger.mainLogger.debug("No existing syncing node found.")
        return
    }

    joined(publicKey, nodeId, nodeIpInfo) {
        if(this.nodes.joining[publicKey]) delete this.nodes.joining[publicKey]
        let existingSyncingNode = this.getExistingSyncingNode(nodeId, nodeIpInfo)
        let existingActiveNode = this.getExistingActiveNode(nodeId, nodeIpInfo)
        if (existingSyncingNode) {
            delete this.nodes.syncing[existingSyncingNode.nodeId]
            Logger.mainLogger.info(`Joined node is found in the syncing list. Removing existing syncing node.`)
        }
        if (existingActiveNode) {
            Logger.mainLogger.info(`Joined node is found in the active list. Comparing the timestamps...`)
            // checking if last heart beat of active node is sent within last x seconds (report interval)
            if (Date.now() - existingActiveNode.timestamp < 1.5 * this.reportInterval) {
                Logger.mainLogger.info(`This node ${existingActiveNode.nodeId} sent heartbeat recently. So, this joined message is neglected.`)
                return // not likely that active node will re-join the network again in a report interval
            }
            Logger.mainLogger.info(`This node ${existingActiveNode.nodeId} does not sent heartbeat recently. So, this joined message is processed.`)
            delete this.nodes.active[existingActiveNode.nodeId]
        }
        this.nodes.syncing[nodeId] = { publicKey, nodeId, nodeIpInfo, timestamp: Date.now() }
        if (!this.history[nodeId]) this.history[nodeId] = {}
        this.history[nodeId].joined = Date.now()
        this.history[nodeId].data = {
            nodeIpInfo,
            nodeId
        }
        this.checkCrashedBefore(this.history[nodeId].data)
        Logger.historyLogger.info(`NODE JOINED, NodeId: ${nodeId}, Ip: ${nodeIpInfo.externalIp}, Port: ${nodeIpInfo.externalPort}`)
    }

    active(nodeId) {
        delete this.nodes.syncing[nodeId]
        this.nodes.active[nodeId] = {}
        this.history[nodeId].active = Date.now()
        const nodeData = this.history[nodeId].data
        Logger.historyLogger.info(`NODE ACTIVE, NodeId: ${nodeId}, Ip: ${nodeData.nodeIpInfo.externalIp}, Port: ${nodeData.nodeIpInfo.externalPort}`)
    }

    checkCrashedBefore(data) {
        let foundInCrashed = Object.values(this.crashedNodes).find(node => node.nodeIpInfo.externalIp === data.nodeIpInfo.externalIp && node.nodeIpInfo.externalPort === data.nodeIpInfo.externalPort)
        if (foundInCrashed) {
            Logger.historyLogger.info(`Crashed node ${foundInCrashed.nodeId} has restarted and active.`)
            console.log(`Crashed node ${foundInCrashed.nodeId} has restarted and active.`)
            delete this.crashedNodes[foundInCrashed.nodeId]
            delete this.nodes.active[foundInCrashed.nodeId]
        }
    }

    removed(nodeId) {
        let removedNode = this.nodes.active[nodeId]
        if (removedNode) {
            if (!this.removedNodes[this.counter]) {
                this.removedNodes[this.counter] = {}
            }
            this.removedNodes.push({
                ip: removedNode.nodeIpInfo.externalIp,
                port: removedNode.nodeIpInfo.externalPort,
                nodeId,
                counter: this.counter
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
        ProfilerModule.profilerInstance.profileSectionStart('heartbeat')
        if (this.nodes.syncing[nodeId]) {
            Logger.mainLogger.debug(`Found heart beating node ${nodeId} in syncing list. Removing it from syncing list.`)
            delete this.nodes.syncing[nodeId]
        }
        this.nodes.active[nodeId] = data
        this.nodes.active[nodeId].nodeId = nodeId
        this.nodes.active[nodeId].timestamp = Date.now()
        this.nodes.active[nodeId].crashed = false
        if (this.history[nodeId]) {
            this.history[nodeId].heartbeat = Date.now()
        }
        if (data.isLost) {
            if (!this.lostNodeIds.get(nodeId)) {
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

        if (data.rareCounters && Object.keys(data.rareCounters).length > 0) {
            this.rareEventCounters[nodeId] = JSON.parse(JSON.stringify(data.rareCounters))// deep clone rare
            // counters so that later it can be deleted from report
        }
        this.nodes.active[nodeId].isLost = this.lostNodeIds.get(nodeId)

        if (this.reportInterval !== data.reportInterval) {
            this.reportInterval = data.reportInterval
        }
        this.totalTxInjected += data.txInjected
        this.totalTxRejected += data.txRejected
        this.totalTxExpired += data.txExpired
        this.totalProcessed += data.txProcessed
        if (this.counter < data.cycleCounter) this.counter = data.cycleCounter

        if (!this.isTimerStarted) {
            setTimeout(() => {
                this.updateAvgAndMaxTps()
            }, this.reportInterval)
            this.isTimerStarted = true
        }

        // decouple rareCounters from report to avoid large report size
        delete this.nodes.active[nodeId].rareCounters

        // this.avgApplied += (data.txInjected - data.txRejected - data.txExpired)
        // writeStream.write(JSON.stringify(this.nodes.active[nodeId], null, 2) + '\n')
        ProfilerModule.profilerInstance.profileSectionEnd('heartbeat')
    }

    updateAvgAndMaxTps() {
        ProfilerModule.profilerInstance.profileSectionStart('updateAvgAndMaxTps')
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
        ProfilerModule.profilerInstance.profileSectionEnd('updateAvgAndMaxTps')
    }

    checkDeadOrAlive() {
        ProfilerModule.profilerInstance.profileSectionStart('checkDeadOrAlive')
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
        ProfilerModule.profilerInstance.profileSectionEnd('checkDeadOrAlive')
    }

    getHistory() {
        return this.history
    }

    getRemoved() {
        const start = this.counter >= 3 ? this.counter - 3 : 0
        const end = this.counter
        let recentRemovedNodes = this.removedNodes.filter(n => n.counter >= start && n.counter <= end)
        return recentRemovedNodes
    }

    getRareEventCounters(shouldAggregate) {
        let str = ``
        if (shouldAggregate) {
            let aggregatedCounter = {}
            for (let nodeId in this.rareEventCounters) {
                let counterMap = this.rareEventCounters[nodeId]
                for (let key in counterMap) {
                    if (aggregatedCounter[key]) aggregatedCounter[key].count += counterMap[key].count
                    else aggregatedCounter[key] = {
                        count: counterMap[key].count,
                        subCounters: {}
                    }
                    let subCounterMap = counterMap[key].subCounters
                    for (let key2 in subCounterMap) {
                        if (aggregatedCounter[key].subCounters[key2]) aggregatedCounter[key].subCounters[key2].count += subCounterMap[key2].count
                        else aggregatedCounter[key].subCounters[key2] = {
                            count: subCounterMap[key2].count,
                            subCounters: {}
                        }
                    }
                }
            }
            return aggregatedCounter
        } else {
            for (let nodeId in this.rareEventCounters) {
                let node = this.nodes.active[nodeId]
                if (!node) continue
                str += `<p><a target="_blank" href="/log?ip=${node.nodeIpInfo.externalIp}&port=${node.nodeIpInfo.externalPort}">${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}</a></p>`
                let counterMap = this.rareEventCounters[nodeId]
                for (let key in counterMap) {
                    str += `<p>&emsp; ${key} &emsp; ${counterMap[key].count}</p>`
                    let subCounterMap = counterMap[key].subCounters
                    for (let key2 in subCounterMap) {
                        str += `<p>&emsp; &emsp; ${key2} &emsp; ${subCounterMap[key2].count}</p>`
                    }
                }
            }
        }
        return str
    }

    report(lastTimestamp) {
        ProfilerModule.profilerInstance.profileSectionStart('GET_report')
        if (lastTimestamp) {
            let updatedNodes = {}
            for (let nodeId in this.nodes.active) {
                if (this.nodes.active[nodeId].timestamp > lastTimestamp) {
                    updatedNodes[nodeId] = this.nodes.active[nodeId]
                }
            }
            for (let nodeId in this.crashedNodes) {
                updatedNodes[nodeId] = this.crashedNodes[nodeId]
            }
            return {
                nodes: {
                    active: updatedNodes,
                    syncing: this.nodes.syncing,
                    joining: this.nodes.joining
                },
                totalInjected: this.totalTxInjected,
                totalRejected: this.totalTxRejected,
                totalExpired: this.totalTxExpired,
                totalProcessed: this.totalProcessed,
                avgTps: this.avgTps,
                maxTps: this.maxTps,
                timestamp: Date.now()
            }
        } else return {
            nodes: this.nodes,
            totalInjected: this.totalTxInjected,
            totalRejected: this.totalTxRejected,
            totalExpired: this.totalTxExpired,
            totalProcessed: this.totalProcessed,
            avgTps: this.avgTps,
            maxTps: this.maxTps,
            timestamp: Date.now()
        }
        ProfilerModule.profilerInstance.profileSectionEnd('GET_report')
    }

    getSyncReports() {
        return this.syncStatements
    }

    getScaleReports() {
        let scaleReports = []
        for (let nodeId in this.nodes.active) {
            const data = this.nodes.active[nodeId]
            scaleReports.push({
                nodeId,
                ip: data.nodeIpInfo.externalIp,
                port: data.nodeIpInfo.externalPort,
                lastScalingTypeWinner: data.lastScalingTypeWinner ? data.lastScalingTypeWinner : null,
                lastScalingTypeRequested: data.lastScalingTypeRequested ? data.lastScalingTypeRequested : null
            })
        }
        return scaleReports
    }

    getActiveList() {
        return Object.values(this.nodes.active)
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
