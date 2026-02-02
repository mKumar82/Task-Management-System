import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-management-system-sepia-five.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check
app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

app.get("/ping", (_req, res) => {
  res.status(200).send("pong");
});

export default app;
