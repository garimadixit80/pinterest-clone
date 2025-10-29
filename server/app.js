const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ MongoDB connection
logger.info("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((error) => logger.error("❌ MongoDB connection error:", error.message));

// ✅ Allow frontend requests (CORS fix)
const allowedOrigins = [
  "http://localhost:3000",               // Local development
  "https://pinterestclonee.netlify.app", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware setup
app.use(express.json());
app.use(passport.initialize());
require("./utils/passport")(passport);
app.use(middleware.requestLogger);

// ✅ Routes
app.use("/api/users", usersRouter);

// ✅ Health check route (to test backend connection on Render)
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Backend running successfully 🚀" });
});

// ✅ Serve frontend (only when deployed together)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ✅ Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
