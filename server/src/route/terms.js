const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();
const { execQuery } = require("../database/database");

router.get("", (req, res, next) => {
  execQuery("CALL GetAllTerms()")
    .then((rows) => {
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", (req, res, next) => {
  execQuery(`CALL GetTerm('${req.params.id}')`)
    .then((rows) => {
      return res.status(200).json(rows[0][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("", (req, res, next) => {
  execQuery(
    `CALL InsertTerm(${Object.values(req.body).map((value) => `'${value}'`)})`
  )
    .then((rows) => {
      res.status(200).json(rows[0][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", (req, res, next) => {
  execQuery(
    `CALL UpdateTerm(${Object.values(req.body).map((value) => `'${value}'`)})`
  )
    .then((rows) => {
      res.status(200).json(rows[0][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:id", (req, res, next) => {
  execQuery(`DELETE FROM term WHERE id='${req.params.id}'`)
    .then((rows) => {
      res.status(200).json({ id: req.params.id, message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
