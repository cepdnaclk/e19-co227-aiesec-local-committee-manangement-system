const mysql = require("mysql");

const fs = require("fs");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "LC_KANDY",
  port: 3306,
  multipleStatements: true,
  // host: process.env.MYSQL_HOST,
  // port: process.env.MYSQL_PORT,
  // user: process.env.MYSQL_USER,
  // password: process.env.MYSQL_PASSWORD,
  // database: process.env.MYSQL_DATABASE,
  // multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    exit(1);
  }

  console.log("Connected to MySQL DB");
});

// create database schema
const schemaPath = path.join(__dirname, "schema.sql");
const schemaScript = fs.readFileSync(schemaPath, "utf8");

// log last time the schema file was modified
fs.stat(schemaPath, (err, stats) => {
  console.log(`${stats.mtime}`);
});

connection.query(schemaScript, (err) => {
  if (err) {
    console.log(err);
    exit(1);
  }
  console.log("Created DB Schema");

  // write the time schema file was last executed
  const filePath = path.join(__dirname, "meta.json");
  const fileData = fs.readFileSync(filePath, "utf8");
  const jsonData = JSON.parse(fileData);
  // TODO: (new Date).toUTCString()
  jsonData["schema-last-run"] = Date.now();
  fs.writeFileSync(filePath, JSON.stringify(jsonData));
});

// populate database
const dataPath = path.join(__dirname, "data.sql");
const dataScript = fs.readFileSync(dataPath, "utf8");
connection.query(dataScript, (err) => {
  if (err) {
    console.log(err);
    exit(1);
  }
  console.log("Populated DB");
});

// create procedures
const procedurePath = path.join(__dirname, "procedure.sql");
const procedureScript = fs.readFileSync(procedurePath, "utf8");
connection.query(procedureScript, (err) => {
  if (err) {
    console.log(err);
    exit(1);
  }
  console.log("Added Procedures");
});

const execQuery = (queryString) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, rows, fields) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = { connection, execQuery };
