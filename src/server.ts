import {UserDB} from './class/user'

global.User = new UserDB()
import {join} from "path/posix";
import {Node} from "./class/node";
import MemoryModule, {
  memoryReportingInstance
} from "./class/profiler/MemoryReporting";
import NestedCounters from "./class/profiler/nestedCounters";
import Profiler from "./class/profiler/profiler";
import Statistics from "./class/profiler/Statistics";

require("dotenv").config();

const {promisify} = require("util");
const http = require("http");
const WebSocket = require("ws");
const Tail = require("tail").Tail;
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");
import Logger = require("./class/logger");

const app = express();

const logDirectory = path.join(__dirname, "req-log");
const clientModule = require.resolve("@shardus/monitor-client");
const clientDirectory = path.dirname(clientModule);
const viewDirectory = path.join(clientDirectory + "/views");
const staticDirectory = path.resolve(clientDirectory + "/public");

console.log("Client directory", clientDirectory)
import logsConfig from './config/monitor-log';
import {mainLogger} from "./class/logger";

const logDir = `monitor-logs`;
const baseDir = ".";
logsConfig.dir = logDir;

let fileWatcher;
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
let fileSubscribers = {};
let file = `${baseDir}/${logDir}/history.log`;
const filePath = path.resolve(file);

http.get[promisify.custom] = function getAsync(options) {
  return new Promise((resolve, reject) => {
    http
      .get(options, (response) => {
        response.end = new Promise((resolve) => response.on("end", resolve));
        resolve(response);
      })
      .on("error", reject);
  });
};
const get = promisify(http.get);

async function getJSON(url) {
  const res = await get(url);
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  await res.end;
  return JSON.parse(body);
}

// const Node = require("./class/node");

const APIRoutes = require("./api");

// config variables
const CONFIG = require("./config").default
console.log("CONFIG", CONFIG)
if (process.env.PORT) {
  CONFIG.port = process.env.PORT;
}

// // Initialize node
const node = new Node();
global.node = node;

// Setup Log Directory
Logger.initLogger(baseDir, logsConfig);

let nestedCounter = new NestedCounters(app);
let profiler = new Profiler(app);
let statistics = new Statistics(
  logDir,
  CONFIG.statistics,
  {
    counters: [],
    watchers: {},
    timers: [],
    manualStats: ["cpuPercent"],
  },
  {}
);
let memoryReporter = new MemoryModule(app);
statistics.startSnapshots();
statistics.on(
  "snapshot",
  memoryReportingInstance.updateCpuPercent.bind(memoryReportingInstance)
);

// ========== ENDPOINTS ==========
memoryReporter.registerEndpoints();
nestedCounter.registerEndpoints();
profiler.registerEndpoints();

console.log("absoluteClientPath", clientDirectory);
console.log("view Directory", viewDirectory);
console.log("static Directory", staticDirectory);

app.set("views", viewDirectory);
app.engine("html", require("ejs").renderFile);
app.use(express.static(staticDirectory));

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
let accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

//Morgan
// app.use(morgan("common", {stream: accessLogStream}));
// app.use(morgan("dev"));

// Parse body params and attach them to req.body
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

global.User.create({
  username: CONFIG.username,
  password: CONFIG.password
})

app.get("/", (req, res) => {
  const numActiveNodes = node.getActiveList().length;
  const maxNodeCount = 200;

  if (numActiveNodes > maxNodeCount) {
    return res.redirect('/large-network')
  }

  res.render("index.html", {title: "test"});
});
app.get("/signin", (req, res) => {
  res.render("signin.html", {title: "test"});
});
app.get("/log", (req, res) => {
  console.log("log server page");
  res.render("log.html", {title: "test"});
});

app.get("/favicon.ico", (req, res) => {
  return res.send()
});

app.get("/history-log", (req, res) => {
  console.log("log server page");
  res.render("history-log.html", { title: "test" });
});

app.get("/large-network", (req, res) => {
  res.render("large-network.html");
});

app.get("/sync", (req, res) => {
    res.render("sync.html");
});

app.get("/chart", (req, res) => {
  res.render("chart.html");
});

app.get('/monitor-events', (_req, res) => {
  res.render('monitor-events.html');
});

app.get('/app-versions', (_req, res) => {
  res.render('app-versions.html');
});

app.get("/summary", async (req, res) => {
  try {
    // Ping a node for the current cycle
    let cycle: any = {};
    let cycleUrl;
    let configUrl;

    const joining = global.node.nodes["joining"]; // { [id: string]: { nodeIpInfo: {...} } }
    const syncing = global.node.nodes["syncing"]; // { [id: string]: { nodeIpInfo: {...} } }
    const active = global.node.nodes["active"]; // { [id: string]: { nodeIpInfo: {...} } }
    const removed = global.node.removedNodes[global.node.counter - 1] || []
    const node = global.node.getRandomNode()
    if (node) {
      cycleUrl = `http://${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}/sync-newest-cycle`;
      configUrl = `http://${node.nodeIpInfo.externalIp}:${node.nodeIpInfo.externalPort}/config`;
      try {
        cycle = await getJSON(cycleUrl);
        cycle = cycle.newestCycle;
      } catch (e) {
        console.log("Cannot get cycle from node");
      }
    }

    const summary = {
      joining: [],
      syncing: [],
      active: [],
    };

    for (const state in summary) {
      for (const id in global.node.nodes[state]) {
        const ip = global.node.nodes[state][id].nodeIpInfo.externalIp;
        const port = global.node.nodes[state][id].nodeIpInfo.externalPort;
        const logStreamerServer = encodeURIComponent(`http://${ip}:3334`);
        summary[state].push(
          `<a href="log?ip=${ip}&port=${port}" target="_blank">[${ip}]</a>`
        );
      }
    }

    let removedHtmlStr = ``;
    for (let node of removed) {
      removedHtmlStr += `${node.ip} `;
    }

    const page = `<!DOCTYPE html>
<html>
  <body>
    cycle: ${cycle && cycle.counter > -1 ? cycle.counter : -1}
      <br />
      <br />
    joining: ${summary.joining.length}
      <p>
        <code>
          ${summary.joining.join(" ")}
        </code>
      </p>
    syncing: ${summary.syncing.length}
      <p>
        <code>
          ${summary.syncing.join(" ")}
        </code>
      </p>
    active: ${summary.active.length}
      <p>
        <code>
          ${summary.active.join(" ")}
        </code>
      </p>
    removed: ${removed.length}
      <p>
        <code>
          ${removedHtmlStr}
        </code>
      </p>

    <br />
    cycleRecord: <a href="${cycleUrl}" target="_blank">${cycleUrl}</a>
    <br /><br />
    config: <a href="${configUrl}" target="_blank">${configUrl}</a>
    <br /><br />
    <p>
      <pre>
        ${
      cycle ? JSON.stringify(cycle, null, 2) : "Cannot get cycle from nodes"
    }
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
`;

    res.setHeader("Content-Type", "text/html");
    res.send(page);
  } catch (e) {
    console.error('Caught error in /summary page', e)
    Logger.mainLogger.error(`Error while rendering /summary page`)
    Logger.mainLogger.error(e)
  }
});

app.use("/api", APIRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  Logger.mainLogger.error(req)
  const error = new Error("API not found!");
  error.message = "404";
  return next(error);
});

app.use((err, req, res, next) => {
  Logger.mainLogger.error('Caught error in error handling middleware', err)
  Logger.mainLogger.error(req)

  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
      stack: CONFIG.env === "development" ? err.stack : {},
    },
    status: err.status,
  })
});

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  Logger.mainLogger.error(err);
});

Logger.mainLogger.info(`file: ${file}`);
Logger.mainLogger.info(`filePath: ${path.resolve(file)}`);

io.on("connection", (socket) => {
  console.log("A client connected", socket.id);
  if (!fileSubscribers[socket.id]) {
    fileSubscribers[socket.id] = true;
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (!data) {
        data = "Found no previous log.";
      }
        // console.log('data', data.split("\n"))
      io.emit("old-data", data);
    });
  }
  socket.on("message", (msg) => {
    if (!fileWatcher) {
      fileWatcher = new Tail(filePath, {fromBeginning: false});
      fileWatcher.watch();
      fileWatcher.on("line", (data) => {
        io.emit("new-history-log", data);
      });
    } else {
      console.log("File watcher already existed.");
    }
  });
});

// HTTP server for searching string in a log file
// [AS] Disabled to not crash Monitor when running non-local nodes
// app.get('/logs', (req, res) => {
//   const fileName = req.query.filename
//   const queryString = req.query.search
//   if (!fileName) return res.json({ error: 'No log filename provided' })
//   if (!queryString) return res.json({ error: 'No queryString provided' })
//   const filePath = `./logs/${fileName}.log`
//   const stream = fs.createReadStream(filePath)
//   let foundTextArr = []
//   stream.on('data', function (buffer) {
//     const text = buffer.toString()
//     let index = text.indexOf(queryString)
//     if (index >= 0) {
//       foundTextArr.push(text.substr(index, 300))
//     }
//   })
//   stream.on('end', function (buffer) {
//     if (foundTextArr.length > 0) {
//       res.json(foundTextArr)
//     } else {
//       console.log('Not found')
//       res.send('Not found')
//     }
//   })
// })

const start = () => {
  server.listen(CONFIG.port, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(`server started on port ${CONFIG.port} (${CONFIG.env})`);
      console.log('history logger', Logger.historyLogger.info)
    Logger.historyLogger.info(`started`);
  });
};

start();

module.exports = app;
