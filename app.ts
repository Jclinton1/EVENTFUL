import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "./src/logging/logger";
import httpLogger from "./src/logging/httplogger";
import { connectToDb } from "./src/db/mongodb";
import CONFIG from "./src/db/mongodb";
import userRoutes from "./src/routes/user.routes";
import eventRoutes from "./src/routes/event.routes";
import { authenticate } from "./src/middleware/authentication";
import './src/cron/notificationScheduler';
import analyticsRoutes from './src/routes/analytics.routes';

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// HTTP Logger Middleware
app.use(httpLogger);

// Database Connection
connectToDb();

// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Security Middleware
app.use(helmet());

// Route Handlers
app.use("/api/users", authenticate, userRoutes);
app.use("/api/events", authenticate, eventRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);



// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Eventful!");
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  console.log(err);
  const errorStatus = err.status || 500;
  res.status(errorStatus).send(err.message);
  next();
});

app.listen(CONFIG.PORT, () => {
  logger.info(`Server started on http://localhost:${CONFIG.PORT}`);
});

export default app;
