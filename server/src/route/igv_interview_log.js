const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

// view answers for questions API each project - should be accessed within each application
router.get("/", (req, res, next) => {
    // if id present send only requested project details
  
    const getIgvAnswers = `SELECT question_id, answer FROM igv_interview_log where expa_id='${req.query.appId}';`;
  
    execQuery(getIgvAnswers)
      .then((rows) => {
        data = rows.map((row) => objectKeysSnakeToCamel(row));
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  });
  
  // edit, update, delete access only for iGV LCVP
  
  // adding new slot per each project - should be accessed within each project
  router.post("/", (req, res, next) => {
    try {
      console.log(req.body);
  
      const [fields, values] = requestBodyToFieldsAndValues(req.body);
  
      const addIgvAnswer = `INSERT INTO igv_interview_log (${fields.toString()}) VALUES (${values.toString()})`;
  
      execQuery(addIgvAnswer)
        .then((rows) => {
          res
            .status(200)
            .json({ message: "New iGV Interview Answer added Successfully" });
        })
  
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  //edit igv questions
  router.put("/", (req, res, next) => {
    try {
      // const [fields, values] = requestBodyToFieldsAndValues(req.body);
      // // Combine the two arrays into a single array.
      // let updateString = "";
  
      // for (let i = 0; i < fields.length; i++) {
      //   updateString += fields[i] + " = ";
      //   updateString += values[i] + ", ";
      // }
  
      // updateString = updateString.substring(0, updateString.length - 2);
  
      const updateIgvAnswerQuery = `UPDATE igv_interview_log SET answer='${req.body.question}' WHERE app_id=${req.body.appId} AND question_id=${req.body.questionId};`;
  
      execQuery(updateIgvAnswerQuery)
        .then((rows) => {
          res.status(200).json({ message: "iGV Answer edited successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  // for deleting igv slots
  router.delete("/", (req, res, next) => {
    try {
      const deleteIgvQuestionQuery = `DELETE FROM igv_interview_log WHERE expa_id=${req.query.expaId} AND question_id=${req.query.questionId}`;
      execQuery(deleteIgvQuestionQuery)
        .then((rows) => {
          res.status(200).json({ message: "iGV Interview Answer Deleted Successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;
  