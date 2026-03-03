import express, { type Request, type Response } from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// routes import
import authRoutes from "@/routes/auth.route";
// import userRoutes from "@/routes/user.route";
import taskRoutes from "@/routes/task.route";

// middlewares import
import { errorHandler } from "@/middlewares/errorHandler";
import { notFoundMiddleware } from "@/middlewares/notFound";
import { logger } from "@/utils/logger";
import { initCronJobs } from "@/services/taskCleanup";

dotenv.config();

const app = express();

//log config
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

app.use(morgan("tiny", { stream }));

// security middlewares
// Set security HTTP headers
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     // will Add  CSP directives back here  set up Swagger later
//   }),
// );

// Enable CORS (Cross-Origin Resource Sharing)
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Rate limiting (Prevents brute-force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window`
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// parser middleware
app.use(express.json());
app.use(cookieParser());

// first route
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Life OS API</h1>
    <p>API is running securely. 🚀</p>
  `);
});

// api routes
const apiRouter = express.Router();
// rate limiter for auth routes
apiRouter.use("/auth", apiLimiter, authRoutes);
// app.use("/users", userRoutes);
apiRouter.use("/tasks", taskRoutes);

// mount api routes
app.use("/dawg", apiRouter);

//  error middleware
app.use(notFoundMiddleware);
app.use(errorHandler);

initCronJobs();

//  start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server is securely listening on port ${PORT}...`);
});
