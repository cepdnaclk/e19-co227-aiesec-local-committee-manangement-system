const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();

const { execQuery } = require("../database/database");

router.get("", (req, res) => {
  execQuery("CALL GetAllTerms()")
    .then((rows) => {
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("", (req, res, next) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const addTermQuery = `INSERT INTO term (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(addTermQuery)
      .then((rows) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

router.put("", (req, res) => {
  try {
    console.log(req.body);

    // check for null requests
    if (!req?.body) {
      return res.status(422).json({ message: "Unprocessable Entity" });
    }

    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < fields.length; i++) {
      updateString += fields[i] + " = ";
      updateString += values[i] + ", ";
    }

    updateString = updateString.substring(0, updateString.length - 2);

    const updateTermQuery = `UPDATE term SET ${updateString} WHERE title = ${values[0]};`;

    connection.query(updateTermQuery, (err, result) => {
      if (err?.code == "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Conflict" });
      } else if (err) {
        return res.status(400).json({ message: "Bad Request" });
      } else {
        return res.status(200).json({ message: "Ok" });
      }
    });
  } catch (err) {
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
