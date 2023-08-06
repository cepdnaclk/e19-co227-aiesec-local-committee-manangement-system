require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// user authentication
app.use("/user", require("./src/route/user"));

// jwt authentication
const authenticateToken = require("./src/middleware/auth");
// app.use(authenticateToken);

// routing
app.use("/member", require("./src/route/member"));
app.use("/term", require("./src/route/term"));
app.use("/resource", require("./src/route/resource"));
app.use("/project", require("./src/route/igv_projects"));

// error logging
app.use(require("./src/middleware/errorLogger"));

// error response handling
app.use(require("./src/middleware/errorHandler"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// close connection to database before exiting on keyboard interrup
const connection = require("./src/database/database");
process.on("SIGINT", function () {
  console.log("Caught interrupt signal");

  // connection.end();
  process.exit(0);
});
