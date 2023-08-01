const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();

const authenticateToken = require("../authVerify");

const connection = require("../database/database");

router.get("", (req, res) => {
  const queryViewAllTerms = "SELECT * FROM term";

  connection.query(queryViewAllTerms, (err, result) => {
    //errors handling
    if (err) {
      console.error("Error during term retrieval:", err);
      return res.json({ message: "Internal Server Error" });
    }
    //for successful retrievals
    console.log(result);
    res.json(result);
  });
});

router.post("", (req, res) => {
  console.log(req.body);
  const [fields, values] = requestBodyToFieldsAndValues(req.body);
  console.log(fields.toString());
  console.log(values.toString());

  res.json({ message: "okay" });
});

module.exports = router;
