require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const Node = require('./class/node');

const APIRoutes = require('./api');

// config variables
const CONFIG = require('./config');
if (process.env.PORT) {
  CONFIG.port = process.env.PORT
}

//Express
const app = express();

// Initialize node
const node = new Node();
global.node = node;

// Setup Log Directory
const logDirectory = path.join(__dirname, 'req-log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
let accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})

//Morgan
app.use(morgan('common', { stream: accessLogStream }));
app.use(morgan('dev'));

// Parse body params and attach them to req.body
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

app.use(helmet());

app.use(cors());

app.use(express.static('./node_modules/monitor-client/'))

app.use('/api', APIRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('API not found!');
  error.status = 404;
  return next(error);
});

app.use((err, req, res, next) =>
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
      stack: CONFIG.env === 'development' ? err.stack : {}
    },
    status: err.status
  })
);

const start = () => {
  app.listen(CONFIG.port, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(`server started on port ${CONFIG.port} (${CONFIG.env})`);
  });
}

start();

module.exports = app;