const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

//get resources

// view all applications - recent ones first

router.get("", (req, res) => {
    // id present send only requested user
    if (req.query.ep_name) {
      const getIgvApplication = `SELECT * FROM igv_application where ep_name='${req.query.ep_name}' ORDER BY applied_date DESC;`;
      execQuery(getIgvApplication)
        .then((rows) => {
          data = objectKeysSnakeToCamel(rows[0]);
          res.status(200).json(data);
        })
        .catch((err) => {
          next(err);
        });
    } else {
      const getIgvApplication = `SELECT * FROM igv_application ORDER BY applied_date DESC ;`;
  
      execQuery(getIgvApplication)
        .then((rows) => {
          data = rows.map((row) => objectKeysSnakeToCamel(row));
          res.status(200).json(data);
        })
        .catch();
    }
  });

// add date into application
router.post("", (req, res, next) => {
    try {
        console.log(req.body);

        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        const igvApplicationAddQuery = `INSERT INTO igv_application (${fields.toString()}) VALUES (${values.toString()})`;

        execQuery(igvApplicationAddQuery)
        .then((rows) => {
            res.status(200).json({ message: "New Application Added Successfully" });
        })
        .catch((err) => {
            next(err);
        });

    } catch (err) {
        next(err);
    }
});

// edit igv application

router.put("", (req, res, next) => {
    try {
      const [fields, values] = requestBodyToFieldsAndValues(req.body);
      // Combine the two arrays into a single array.
      let updateString = "";
  
      for (let i = 0; i < fields.length; i++) {
        updateString += fields[i] + " = ";
        updateString += values[i] + ", ";
      }
  
      updateString = updateString.substring(0, updateString.length - 2);
  
      const updateIgvApplicationQuery = `UPDATE igv_application SET ${updateString} WHERE id=${values[0]};`;
  
      execQuery(updateIgvApplicationQuery)
        .then((rows) => {
          res.status(200).json({ message: "Application updated successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });

// delete application - delete access only for LCVP iGV 

router.delete("", (req, res, next) => {
    try {
      const deleteMemberQuery = `DELETE FROM igv_application WHERE id=${req.query.id}`;
      execQuery(deleteMemberQuery)
        .then((rows) => {
          res.status(200).json({ message: "Member deleted Sucessfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
});
  
  module.exports = router;