// Load environment variables
require("dotenv").config();

// External libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize app and settings
const app = express();
const port = process.env.PORT || 8081;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', "./src/static/views");
app.use(express.static('./src/static/'));


// public endpoints
app.get("/", (req, res) => { res.render('./welcome')});
// user authentication
app.use("/user", require("./src/route/user"));

// jwt authentication
const { authenticateToken } = require("./src/middleware/auth");
//app.use(authenticateToken);

// protected endpoints
// routing
app.use("", require("./src/mainRouter"));

// close connection to database before exiting on keyboard interrup
const connection = require("./src/database/database");

// error logging
app.use(require("./src/middleware/errorLogger"));

// error response handling
app.use(require("./src/middleware/errorHandler"));

// scheduled Tasks
const scheduledTasks = require("./src/utils/scheduledTasks");
// scheduledTasks.start();

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Graceful shutdown on keyboard interrupt
process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  // Uncomment to end the connection on interrupt
  // connection.end();
  process.exit(0);
});
