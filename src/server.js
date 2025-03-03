import app from "./index.js";
const serverless = require("serverless-http");

module.exports = serverless(app);