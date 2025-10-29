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
logger.info("connecting to", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((error) => logger.error("❌ Error connecting to MongoDB:", error.message));

// ✅ Allow frontend requests (CORS fix)
const allowedOrigins = [
  "http://localhost:3000", // local
  "https://pinterestclonee.netlify.app", // your Netlify frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware setup
app.use(express.json());
app.use(passport.initialize());
require("./utils/passport")(passport);
app.use(middleware.requestLogger);

// ✅ API routes
app.use("/api/users", usersRouter);

// ✅ Health check route (for testing Render connection)
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running successfully 🚀" });
});

// ✅ Serve frontend in production (if hosting together)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
