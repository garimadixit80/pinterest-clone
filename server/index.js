require("dotenv").config();
const http = require("http");
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT}`);
});
