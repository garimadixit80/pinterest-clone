const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const app = express();

// ✅ MongoDB connection
logger.info("connecting to", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) => logger.error("error connecting to MongoDB:", error.message));

// ✅ Allow frontend requests (CORS fix)
const allowedOrigins = [
  "http://localhost:3000", // for local testing
  "https://pinterestclonee.netlify.app", // ⚠️ replace this with your actual Netlify URL
];

app.use(
  cors({
    origin: allowedOrigins,
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

// ✅ Serve frontend in production (optional, if deploying together)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildPath, "index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
