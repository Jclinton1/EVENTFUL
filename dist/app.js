"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const logger = require("./src/logging/logger");
const httpLogger = require('./src/logging/httplogger');
const connectToDb = require('./db/mongodb');
const CONFIG = require('./config/config');
const userRoutes = require('./src/routes/user.routes');
const eventRoutes = require('./src/routes/event.routes');
const authentication_1 = require("./src/middleware/authentication");
const app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(httpLogger);
app.use(logger);
connectToDb();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Limiting middleware to all requests
app.use(limiter);
//security middleware
app.use(helmet());
app.use(authentication_1.authenticate);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to Eventful!');
});
app.use((err, req, res, next) => {
    logger.error(err.message);
    console.log(err);
    const errorStatus = err.status || 500;
    res.status(errorStatus).send(err.message);
    next();
});
app.listen(CONFIG.PORT, () => {
    logger.info(`Server started on http://localhost:${CONFIG.PORT}`);
});
exports.default = app;
