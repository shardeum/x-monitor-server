require("dotenv").config();
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
const clientVersionDirectory = path.join(clientDirectory + "/package.json");
const serverVersionDirectory = path.join(path.dirname(path.dirname(path.dirname(require.main.filename))), 'package.json');

const clientPackageJson = fs.readFileSync(clientVersionDirectory, 'utf8')
const serverPackageJson = fs.readFileSync(serverVersionDirectory, 'utf8')

const clientPackageData = JSON.parse(clientPackageJson)
const serverPackageData = JSON.parse(serverPackageJson)

export const clientPackageVersion = clientPackageData.version
export const serverPackageVersion = serverPackageData.version

console.log("Client directory", clientDirectory)
import logsConfig from './config/monitor-log';
import {mainLogger} from "./class/logger";
import { NodeList } from './interface/interface';
import { setupArchiverDiscovery } from '@shardus/archiver-discovery';

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

// Setup Log Directory
Logger.initLogger(baseDir, logsConfig);

// // // Initialize node
const node = new Node();
global.node = node;

if (CONFIG.restoreFromBackup) {
  try {
    let jsonData = fs.readFileSync(CONFIG.backup.nodelist_path, 'utf8');
    const restoreNodelist = JSON.parse(jsonData);
    console.log("Found node list backup file restoring. . . ");
    global.node.setNodeList(restoreNodelist);

    jsonData = fs.readFileSync(CONFIG.backup.networkStat_path, 'utf8');
    const restoreNetworkStats = JSON.parse(jsonData);
    console.log("Found network stat backup file restoring. . . ");
    global.node.setNetworkStat(restoreNetworkStats);
  } catch (err) {
    console.error(err);
  }
}

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
  res.render("history-log.html", {title: "test"});
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
    let sortOrder = req.query.sortOrder || 'asc';

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
      let nodesArray = [];
      for (const id in global.node.nodes[state]) {
        const ip = global.node.nodes[state][id].nodeIpInfo.externalIp;
        const port = global.node.nodes[state][id].nodeIpInfo.externalPort;
        const link = `<a href="log?ip=${ip}&port=${port}" target="_blank">[${ip}:${port}]</a>`;

        let index = nodesArray.findIndex((existingNode) =>
          sortOrder === 'asc' ? `${existingNode.ip}:${existingNode.port}`.localeCompare(`${ip}:${port}`) > 0 : `${existingNode.ip}:${existingNode.port}`.localeCompare(`${ip}:${port}`) < 0
        );

        if (index === -1) {
          // If no suitable index was found, add the node at the end of the array
          nodesArray.push({ ip, port, link });
        } else {
          // Otherwise, insert the node at the correct index to maintain the sorted order
          nodesArray.splice(index, 0, { ip, port, link });
        }

      }

      // Push sorted links to summary
      nodesArray.forEach(node => summary[state].push(node.link));
    }

    let removedNodesArray = removed.map(node => ({
      ip: node.ip,
      port: node.port,
      link: `<a href="log?ip=${node.ip}&port=${node.port}" target="_blank">[${node.ip}:${node.port}]</a>`
    }));
    removedNodesArray.sort((a, b) => sortOrder === 'asc' ? `${a.ip}:${a.port}`.localeCompare(`${b.ip}:${b.port}`) : `${b.ip}:${b.port}`.localeCompare(`${a.ip}:${a.port}`));
    let removedNodeLinks = removedNodesArray.map(node => node.link);

    const page = `<!DOCTYPE html>
<html>
  <body>
    <div>
      <label title="Sort by IP and Port">Sort:</label>
      <button onclick="setSortOrder('asc')">Ascending</button>
      <button onclick="setSortOrder('desc')">Descending</button>
    </div>
    <div>
      <label for="reloadCheckbox">Auto Reload:</label>
      <input type="checkbox" id="reloadCheckbox" onchange="toggleReload()" checked>
    </div>
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
          ${removedNodeLinks.join(" ")}
        </code>
      </p>

    <br />
    cycleRecord: <a href="${cycleUrl}" target="_blank">${cycleUrl}</a>
    <br /><br />
    config: <a href="${configUrl}" target="_blank">${configUrl}</a>
    <br /><br />
    <p>
      <pre>
        ${cycle ? JSON.stringify(cycle, null, 2) : "Cannot get cycle from nodes"}
      </pre>
    </p>
  </body>

  <script>
    function setSortOrder(order) {
      let url = new URL(window.location.href);
      url.searchParams.set('sortOrder', order);
      window.location.replace(url.toString());
    }

    window.addEventListener("load", (event) => {
      // Enable auto reload on page load
      enableAutoReload();
    });

    function enableAutoReload() {
      window.autoReloadIntervalHandler = setInterval(function() {
        console.log('Page reloading...');
        window.location.reload(true);
      }, 10000); // reload page every 10 seconds
    }

    function disableAutoReload() {
      // Stop reloading the page
      clearInterval(window.autoReloadIntervalHandler);
    }

    function toggleReload() {
      if (document.getElementById("reloadCheckbox").checked) {
        // If checkbox set start reloading the page
        enableAutoReload();
      } else {
        // If checkbox not set stop reloading the page
        disableAutoReload();
      }
    }
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

app.get('/get-newest-cycle', async (req, res) => {
  try {
    const ip = req.query.ip;
    const port = req.query.port;
    const url = `http://${ip}:${port}/sync-newest-cycle`;
    const response = await get(url);
    let body = '';
    response.on('data', chunk => {
      body += chunk;
    });
    await new Promise(resolve => response.on('end', resolve));
    const data = JSON.parse(body);
    res.json(data);
  } catch (error) {
    console.error('Error making API call to /get-newest-cycle: ', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.use("/api", APIRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("API not found!");
  error.message = "404";
  return next(error);
});

app.use((err, req, res, next) => {
  Logger.mainLogger.error('Caught error in error handling middleware', err)
  Logger.mainLogger.error('Request:', req.url)

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
  io.emit("versions", {clientPackageVersion, serverPackageVersion});
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

let archiverConfigFilePath = path.resolve(process.cwd(), '../archiverConfig.json')
if (fs.existsSync(archiverConfigFilePath)) {
  console.log('Found archiverConfig.json file at', archiverConfigFilePath)
} else {
  archiverConfigFilePath = path.resolve(process.cwd(), 'archiverConfig.json')
}

console.log(`ARCHIVER_INFO ENV`, process.env.ARCHIVER_INFO)
console.log(`archiverConfigFilePath`, archiverConfigFilePath)

setupArchiverDiscovery({
  customConfigPath: archiverConfigFilePath,
  customArchiverListEnv: 'ARCHIVER_INFO'
}).then(() => {
  console.log('Finished setting up archiver discovery!');
  start();
}).catch((e) => {
  console.error('Error setting up archiver discovery', e);
})

process.on('SIGINT', async () => {
  graceful_shutdown();
})
//gracefull shutdown suppport in windows. should mirror what SIGINT does in linux
process.on('message', async (msg) => {
  if (msg == 'shutdown') {
    graceful_shutdown();
  }
})
process.on('SIGTERM', async () => {
  graceful_shutdown();
})

function graceful_shutdown() {
  try {
    global.node.createNodeListBackup(CONFIG.backup.nodelist_path);
    global.node.createNetworkStatBackup(CONFIG.backup.networkStat_path);
  } catch (e: any) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

module.exports = app;
