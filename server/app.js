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
const { authenticateToken } = require("./src/middleware/auth");
//app.use(authenticateToken);

// routing
app.use("/member", require("./src/route/member"));
app.use("/terms", require("./src/route/terms"));
app.use("/resource", require("./src/route/resource"));
app.use("/project", require("./src/route/igv_projects"));
app.use("/slot", require("./src/route/igv_slots"));
app.use("/question", require("./src/route/igv_question"));
app.use("/application", require("./src/route/igv_application"));
app.use("/event", require("./src/route/events"));
app.use("/email", require("./src/route/email"));
app.use("/ogv", require("./src/route/ogv_applicant"));

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
