const express = require("express");
const router = express.Router();

const { connection, execQuery } = require("../database/database");

// Function to generate the SQL query for a table count
const generateCountQueryForTable = (tableName, alias) => {
  return `(SELECT COUNT(*) FROM ${tableName} WHERE claimStatus = FALSE ) AS ${alias}`;
};

router.get("/pending-claims", async (req, res, next) => {
  // List of tables and their aliases
  const tables = [
    { tableName: "igv_application", alias: "igv" },
    { tableName: "ogv_applicants", alias: "ogv" },
    // TODO
    // { tableName: "igt_application", alias: "igt" },
    // { tableName: "ogt_applicants", alias: "ogt" },
    // ... add more if needed
  ];

  // Construct the query dynamically
  const queryString = `SELECT ${tables
    .map((table) => generateCountQueryForTable(table.tableName, table.alias))
    .join(", ")}`;

  try {
    const rows = await execQuery(queryString);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Function to generate the SQL query for a table amount sum
const generateSumQueryForTable = (tableName, alias) => {
  return `(SELECT SUM(paymentAmount) FROM ${tableName} WHERE claimStatus = TRUE ) AS ${alias}`;
};

router.get("/totalRevenue", async (req, res, next) => {
  // List of tables and their aliases
  const tables = [
    { tableName: "igv_application", alias: "igv" },
    { tableName: "ogv_applicants", alias: "ogv" },
    // ... add more if needed
  ];

  // Construct the query dynamically
  const queryString = `SELECT ${tables
    .map((table) => generateSumQueryForTable(table.tableName, table.alias))
    .join(", ")}`;

  try {
    const rows = await execQuery(queryString);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/claimDetails", async (req, res, next) => {
  //TODO::add for other departments

  const igvQueryString = `SELECT appId AS id, team AS label, claimStatus FROM igv_application;`;
  const ogvQueryString = `SELECT id, firstName AS label, claimStatus FROM ogv_applicants;`;

  try {
    const igvRows = await execQuery(igvQueryString);
    const ogvRows = await execQuery(ogvQueryString);
    res.status(200).json({
      igv: igvRows,
      ogv: ogvRows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
