const express = require("express");
const router = express.Router();

const { execQuery } = require("../database/database");

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

// view questions API each project - should be accessed within each project
router.get("/", (req, res, next) => {
  // if id present send only requested project details

  const getIgvQuestion = `SELECT question_id, question FROM igv_question where expa_id='${req.query.expaId}';`;

  execQuery(getIgvQuestion)
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

    const addIgvQuestion = `INSERT INTO igv_question (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(addIgvQuestion)
      .then((rows) => {
        res
          .status(200)
          .json({ message: "New iGV Question Added Successfully" });
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

    const updateIgvQuestionQuery = `UPDATE igv_question SET question='${req.body.question}' WHERE expa_id=${req.body.expaId} AND question_id=${req.body.questionId};`;

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
router.delete("/", (req, res, next) => {
  try {
    const deleteIgvQuestionQuery = `DELETE FROM igv_question WHERE expa_id=${req.query.expaId} AND question_id=${req.query.questionId}`;
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
