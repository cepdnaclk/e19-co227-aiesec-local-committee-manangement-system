const express = require("express");
const router = express.Router();
const { execQuery } = require("../../database/database");

router.get("/:expaId", (req, res, next) => {
  const getIgvQuestions = `SELECT questionId, question FROM igv_question where expaId='${req?.params?.expaId}';`;

  execQuery(getIgvQuestions)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:expaId", (req, res, next) => {
  const addIgvQuestion = `INSERT INTO igv_question (expaId, question) VALUES ('${req?.params?.expaId}', '${req?.body?.question}');
  SELECT questionId, question FROM igv_question where expaId='${req?.params?.expaId}' AND questionId=(SELECT LAST_INSERT_ID());`;

  execQuery(addIgvQuestion)
    .then((rows) => {
      res.status(200).json(rows[1][0]);
    })

    .catch((err) => {
      next(err);
    });
});

router.put("/:expaId/:questionId", (req, res, next) => {
  const updateIgvQuestion = `UPDATE igv_question SET question='${req?.body?.question}' WHERE expaId=${req?.params?.expaId} AND questionId=${req?.params?.questionId};
    SELECT questionId, question FROM igv_question where expaId='${req?.params?.expaId}' AND questionId=${req?.params?.questionId};`;
  execQuery(updateIgvQuestion)
    .then((rows) => {
      res.status(200).json(rows[1][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:expaId/:questionId", (req, res, next) => {
  const deleteIgvQuestion = `DELETE FROM igv_question WHERE expaId=${req?.params?.expaId} AND questionId=${req?.params?.questionId};`;
  execQuery(deleteIgvQuestion)
    .then((rows) => {
      res.status(200).json({ questionId: req?.params?.questionId });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
