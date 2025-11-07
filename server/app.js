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

// ==============================
// ✅ Health check (for Render ping)
// ==============================
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Backend running successfully 🚀" });
});

// ==============================
// ✅ MongoDB Connection
// ==============================
logger.info("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((error) =>
    logger.error("❌ MongoDB connection error:", error.message)
  );

// ==============================
// ✅ CORS Configuration
// ==============================
const allowedOrigins = [
  "http://localhost:3000",               // Local dev
  "https://pinterestclonee.netlify.app", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow server-to-server or Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked CORS request from: ${origin}`);
        callback(null, false); // Don't crash; just reject
      }
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==============================
// ✅ Middleware Setup
// ==============================
app.use(express.json());
app.use(passport.initialize());
require("./utils/passport")(passport);
app.use(middleware.requestLogger);

// ==============================
// ✅ Routes
// ==============================
app.use("/api/users", usersRouter);

// ==============================
// ✅ Serve Frontend (only if both are deployed together)
// ==============================
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ==============================
// ✅ Error Handling
// ==============================
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// ==============================
// ✅ Export App
// ==============================
module.exports = app;
