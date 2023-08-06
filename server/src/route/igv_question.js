const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();

const { connection, execQuery } = require("../database/database");



// view questions API each project - should be accessed within each project
router.get("", (req, res) => {
    // if id present send only requested project details
    
    const getIgvQuestion = `SELECT * FROM igv_question where expa_id='${req.query.expa_id}';`;
    
    execQuery(getIgvQuestion)
    .then((rows) => {
        data = objectKeysSnakeToCamel(rows[0]);
        res.status(200).json(data);
    })
    .catch((err) => {
        next(err);
    });

  });

// edit, update, delete access only for iGV LCVP 

// adding new slot per each project - should be accessed within each project
router.post("", (req, res, next) => {

    try {
        console.log(req.body);
        
        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        
        const addIgvQuestion = `INSERT INTO igv_question (${fields.toString()}) VALUES (${values.toString()})`;
        
        execQuery(addIgvQuestion)
        .then((rows) => {
            res.status(200).json({message: "New iGV Question Added Successfully" });
        })

        .catch((err) => {
          next(err);
        });

    } catch (err) {
      next(err);
    }
}); 

//edit igv questions
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
  
      const updateIgvQuestionQuery = `UPDATE igv_question SET ${updateString} WHERE expa_id=${values[0]};`;
  
      execQuery(updateIgvQuestionQuery)
        .then((rows) => {
          res.status(200).json({ message: "iGV Question edited successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });

// for deleting igv slots
router.delete("", (req, res, next) => {
    try {
        const deleteIgvQuestionQuery = `DELETE FROM igv_question WHERE expa_id=${req.query.expa_id}`;
        execQuery(deleteIgvQuestionQuery)
        .then((rows) => {
            res.status(200).json({ message: "iGV Question Deleted Successfully" });
        })
        .catch((err) => {
            next(err);
        });
    } catch (err) {
        next(err);
    }
    });
      
    module.exports = router;