const express = require("express");
const router = express.Router();

const { execQuery } = require("../../database/database");

router.post("", (req, res, next) => {
  console.log(JSON.stringify(req?.body));
  return res.sendStatus(200);
});

module.exports = router;
