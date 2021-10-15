const NS_PER_SEC = 1e9

const os = require('os')
const process = require('process')
let statisticsInstance

let memoryReportingInstance
let Node = global.node

class MemoryReporting {

    constructor(server) {
        console.log("Initialising MemoryReport")
        const StatisticsModule = require('./Statistics')
        console.log("StatisticsModule", StatisticsModule)
        this.statisticsInstance = StatisticsModule.statisticsInstance
        module.exports.memoryReportingInstance = this
        this.report = []
        this.server = server
        this.lastCPUTimes = this.getCPUTimes()
        console.log("this", this)
    }

    registerEndpoints() {
        this.server.get('/memory', (req, res) => {
            let toMB = 1 / 1000000
            let report = process.memoryUsage()

            res.write(`System Memory Report.  Timestamp: ${Date.now()}\n`)
            res.write(`rss: ${(report.rss * toMB).toFixed(2)} MB\n`)
            res.write(`heapTotal: ${(report.heapTotal * toMB).toFixed(2)} MB\n`)
            res.write(`heapUsed: ${(report.heapUsed * toMB).toFixed(2)} MB\n`)
            res.write(`external: ${(report.external * toMB).toFixed(2)} MB\n`)
            res.write(`arrayBuffers: ${(report.arrayBuffers * toMB).toFixed(2)} MB\n\n\n`)

            this.gatherReport()
            this.reportToStream(this.report, res, 0)
            res.end()
        })

        // this.server.get('memory-gc', (req, res) => {
        //     res.write(`System Memory Report.  Timestamp: ${Date.now()}\n`)
        //     try {
        //         if (global.gc) {
        //             global.gc();
        //             res.write('garbage collected!');
        //         } else {
        //             res.write('No access to global.gc.  run with node --expose-gc');
        //         }
        //     } catch (e) {
        //         res.write('ex:No access to global.gc.  run with node --expose-gc');
        //     }
        //     res.end()
        // })
    }

    updateCpuPercent() {
        let cpuPercent = this.cpuPercent()
        this.statisticsInstance.setManualStat('cpuPercent', cpuPercent)
    }

    addToReport(
        category,
        subcat,
        itemKey,
        count
    ) {
        let obj = { category, subcat, itemKey, count }
        this.report.push(obj)
    }

    reportToStream(report, stream, indent) {
        let indentText = '___'.repeat(indent)
        for (let item of report) {
            let {category, subcat, itemKey, count} = item
            let countStr = `${count}`
            stream.write(
                `${countStr.padStart(10)} ${category} ${subcat} ${itemKey}\n`
            )
        }
    }

    gatherReport() {
        this.report = []
        this.stateReport()
        this.systemProcessReport()
    }

    getCPUTimes() {
        const cpus = os.cpus()
        let times = []

        for (let cpu of cpus) {
            let timeObj = {}
            let total = 0
            for (const [key, value] of Object.entries(cpu.times)) {
                let time = Number(value)
                total += time
                timeObj[key] = value
            }
            timeObj['total'] = total

            times.push(timeObj)
        }
        return times
    }

    cpuPercent() {
        let currentTimes = this.getCPUTimes()

        let deltaTimes= []
        let percentTimes= []

        let percentTotal = 0

        for (let i = 0; i < currentTimes.length; i++) {
            const currentTimeEntry = currentTimes[i]
            const lastTimeEntry = this.lastCPUTimes[i]
            let deltaTimeObj= {}
            for (const [key, value] of Object.entries(currentTimeEntry)) {
                deltaTimeObj[key] = currentTimeEntry[key] - lastTimeEntry[key]
            }
            deltaTimes.push(deltaTimeObj)

            for (const [key, value] of Object.entries(currentTimeEntry)) {
                percentTimes[key] = deltaTimeObj[key] / deltaTimeObj['total']
            }

            percentTotal += percentTimes['user'] || 0
            percentTotal += percentTimes['nice'] || 0
            percentTotal += percentTimes['sys'] || 0
        }

        this.lastCPUTimes = currentTimes
        return percentTotal / currentTimes.length
    }

    roundTo3decimals(num){
        return Math.round((num + Number.EPSILON) * 1000) / 1000
    }

    stateReport() {
        let Node = global.node
        let numActiveNodes = Node.getActiveList().length
        this.addToReport('P2P','Nodelist', 'numActiveNodes', numActiveNodes )
    }

    systemProcessReport() {
        this.addToReport('Process','CPU', 'cpuPercent', this.roundTo3decimals(this.cpuPercent() * 100) )

        let avgCPU = this.statisticsInstance.getAverage('cpuPercent')
        this.addToReport('Process','CPU', 'cpuAVGPercent', this.roundTo3decimals(avgCPU * 100) )
        let multiStats = this.statisticsInstance.getMultiStatReport('cpuPercent')

        multiStats.allVals.forEach(function(val, index) {
            multiStats.allVals[index] = Math.round(val * 100);
        })
        multiStats.min = this.roundTo3decimals(multiStats.min * 100)
        multiStats.max = this.roundTo3decimals(multiStats.max * 100)
        multiStats.avg = this.roundTo3decimals(multiStats.avg * 100)

        this.addToReport('Process','CPU', `cpu: ${JSON.stringify(multiStats)}`, 1)

        let report = process.resourceUsage()
        for (const [key, value] of Object.entries(report)) {
            this.addToReport('Process','Details', key, value )
        }
    }
}
module.exports.MemoryReporting = MemoryReporting
