require('dotenv').config()

const { promisify } = require('util')
const http = require('http')
const WebSocket = require('ws')
const Tail = require('tail').Tail
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
const rfs = require('rotating-file-stream')

http.get[promisify.custom] = function getAsync(options) {
  return new Promise((resolve, reject) => {
    http
      .get(options, (response) => {
        response.end = new Promise((resolve) => response.on('end', resolve))
        resolve(response)
      })
      .on('error', reject)
  })
}
const get = promisify(http.get)

async function getJSON(url) {
  const res = await get(url)
  let body = ''
  res.on('data', (chunk) => (body += chunk))
  await res.end
  return JSON.parse(body)
}

const Node = require('./class/node')

const APIRoutes = require('./api')

// config variables
const CONFIG = require('./config')
if (process.env.PORT) {
  CONFIG.port = process.env.PORT
}

//Express
const app = express()

// Initialize node
const node = new Node()
global.node = node

// Setup Log Directory
const logDirectory = path.join(__dirname, 'req-log')

const clientModule = require.resolve('monitor-client')
const clientDirectory = path.dirname(clientModule)
const viewDirectory = path.join(clientDirectory + '/')
const staticDirectory = path.resolve(clientDirectory + '/')
// const viewDirectory = path.join(clientDirectory + '/views');
// const staticDirectory = path.resolve(clientDirectory + '/public');

console.log('absoluteClientPath', clientDirectory)
console.log('view Directory', viewDirectory)
console.log('static Directory', staticDirectory)

app.set('views', viewDirectory)
app.engine('html', require('ejs').renderFile)
app.use(express.static(staticDirectory))

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
})

//Morgan
app.use(morgan('common', { stream: accessLogStream }))
app.use(morgan('dev'))

// Parse body params and attach them to req.body
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

app.use(helmet())

app.use(cors())

// app.use('/', express.static(path.dirname(require.resolve('monitor-client'))))
app.get('/', (req, res) => {
  res.render('index.html', { title: 'test' })
})
app.get('/log', (req, res) => {
  console.log('log server page')
  res.render('log.html', { title: 'test' })
})

// log-streamer remote log viewing client
app.get('/log2', (req, res) => {
  console.log('log server page')
  res.render('log2.html', { title: 'test' })
})

// Node totals summary view for monitoring large networks
app.get('/summary', async (req, res) => {
  // Ping a node for the current cycle
  let cycle = {}

  const joining = global.node.nodes['joining'] // { [id: string]: { nodeIpInfo: {...} } }
  const syncing = global.node.nodes['syncing'] // { [id: string]: { nodeIpInfo: {...} } }
  const active = global.node.nodes['active'] // { [id: string]: { nodeIpInfo: {...} } }
  const node = Object.values(active)[0] || Object.values(syncing)[0] || Object.values(joining)[0]
  const cycleUrl = `http://${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}/sync-newest-cycle`
  const configUrl = `http://${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}/config`
  if (node) {
    try {
      cycle = await getJSON(cycleUrl)
      cycle = cycle.newestCycle
    } catch (e) {
      console.log('Cannot get cycle from node')
    }
  }

  const summary = {
    joining: [],
    syncing: [],
    active: [],
  }

  for (const state in summary) {
    for (const id in global.node.nodes[state]) {
      const ip = global.node.nodes[state][id].nodeIpInfo.externalIp
      const logStreamerServer = encodeURIComponent(`http://${ip}:3334`)
      summary[state].push(`<a href="log2#server=${logStreamerServer}" target="_blank">[${ip}]</a>`)
    }
  }

  const page = `<!DOCTYPE html>
<html>
  <body>
    cycle: ${cycle && (cycle.counter > -1) ? cycle.counter : -1}
      <br />
      <br />
    joining: ${summary.joining.length}
      <p>
        <code>
          ${summary.joining.join(' ')}
        </code>
      </p>
    syncing: ${summary.syncing.length}
      <p>
        <code>
          ${summary.syncing.join(' ')}
        </code>
      </p>
    active: ${summary.active.length}
      <p>
        <code>
          ${summary.active.join(' ')}
        </code>
      </p>

    <br />
    cycleRecord: <a href="${cycleUrl}" target="_blank">${cycleUrl}</a>
    <br /><br />
    config: <a href="${configUrl}" target="_blank">${configUrl}</a>
    <br /><br />
    <p>
      <pre>
        ${cycle ? JSON.stringify(cycle, null, 2) : 'Cannot get cycle from nodes'}
      </pre>
    </p>
  </body>

  <script>
    setInterval(() => {
      console.log('reload')
      window.location.reload(true)
    }, 10000)
  </script> 
</html>
`

  res.setHeader('Content-Type', 'text/html')
  res.send(page)
})

app.use('/api', APIRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('API not found!')
  error.status = 404
  return next(error)
})

app.use((err, req, res, next) =>
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
      stack: CONFIG.env === 'development' ? err.stack : {},
    },
    status: err.status,
  })
)

// Web Socket Server to listen new logs
const server = http.createServer()
const wss = new WebSocket.Server({ server })
let socketConnections = {}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    let { node, slot } = JSON.parse(data)
    console.log('Requested log: ', node)
    console.log('resolved file path', path.resolve(`../../instances/shardus-instance-${node.port}/logs/${node.filename}.log`))
    const filePath = path.resolve(`../instances/shardus-instance-${node.port}/logs/${node.filename}.log`)
    if (socketConnections[slot]) {
      console.log('Unwatching previous log file...')
      socketConnections[slot].unwatch()
      socketConnections[slot] = null
    }
    socketConnections[slot] = new Tail(filePath, { fromBeginning: false })
    socketConnections[slot].watch()
    socketConnections[slot].on('line', (data) => {
      // console.log(`New data detected. Slot`, slot, node.port, node.filename)
      ws.send(
        JSON.stringify({
          slot: slot,
          data: '\n' + data,
        })
      )
    })
  })
})

server.listen(8080, (err) => {
  if (err) console.log(err)
  console.log(`Web Socket server is listening at port 8080`)
})

// HTTP server for searching string in a log file
app.get('/logs', (req, res) => {
  const fileName = req.query.filename
  const queryString = req.query.search
  if (!fileName) return res.json({ error: 'No log filename provided' })
  if (!queryString) return res.json({ error: 'No queryString provided' })
  const filePath = `./logs/${fileName}.log`
  const stream = fs.createReadStream(filePath)
  let foundTextArr = []
  stream.on('data', function (buffer) {
    const text = buffer.toString()
    let index = text.indexOf(queryString)
    if (index >= 0) {
      foundTextArr.push(text.substr(index, 300))
    }
  })
  stream.on('end', function (buffer) {
    if (foundTextArr.length > 0) {
      res.json(foundTextArr)
    } else {
      console.log('Not found')
      res.send('Not found')
    }
  })
})

const start = () => {
  app.listen(CONFIG.port, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
    console.log(`server started on port ${CONFIG.port} (${CONFIG.env})`)
  })
}

start()

module.exports = app
