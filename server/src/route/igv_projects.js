const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();

const { connection, execQuery } = require("../database/database");

// view projects API
router.get("", (req, res) => {
    // if id present send only requested project details
    if (req.query.id) {
      const getIgvProject = `SELECT * FROM igv_project where project_name='${req.query.project_name}';`;
      execQuery(getIgvProject)
        .then((rows) => {
          data = objectKeysSnakeToCamel(rows[0]);
          res.status(200).json(data);
        })
        .catch((err) => {
          next(err);
        });
    } else {
      const getIgvProject = `SELECT * FROM igv_project;`;
  
      execQuery(getIgvProject)
        .then((rows) => {
          data = rows.map((row) => objectKeysSnakeToCamel(row));
          res.status(200).json(data);
        })
        .catch();
    }
  });

// edit, update, delete access only for iGV LCVP

//API for adding new iGV project
router.post("", (req, res, next) => {

    try {

        console.log(req.body);
        
        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        
        const addIgvProject = `INSERT INTO igv_project (${fields.toString()}) VALUES (${values.toString()})`;
        
        execQuery(addIgvProject)
        .then((rows) => {
            res.status(200).json({message: "New iGV Project Added Successfully" });
        })

        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
}); 

//edit igv projects

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
  
      const updateIgvProjectQuery = `UPDATE igv_project SET ${updateString} WHERE expa_id=${values[0]};`;
  
      execQuery(updateIgvProjectQuery)
        .then((rows) => {
          res.status(200).json({ message: "iGV Project edited successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
});

// delete iGV project

router.delete("", (req, res, next) => {
    try {
        const deleteMemberQuery = `DELETE FROM igv_project WHERE expa_id=${req.query.expa_id}`;
        execQuery(deleteMemberQuery)
        .then((rows) => {
            res.status(200).json({ message: "iGV Project Deleted Successfully" });
        })
        .catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    }
});
  
  module.exports = router;