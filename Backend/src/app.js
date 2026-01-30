const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const requestId = require('./utils/requestId');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(requestId());

// include request id in logs
morgan.token('id', (req) => req.id);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :id'));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api', routes);

// Friendly root response instead of 404
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Plant Disease Detector API',
    status: 'running',
    routes: ['/api/health']
  });
});

// Avoid 404 for browsers requesting /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;