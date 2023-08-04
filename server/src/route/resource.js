const express = require("express");
const router = express.Router();

const connection = require("../database/database");

router.get("/faculty", (req, res) => {
  const queryGetFaculties = "SELECT * FROM faculty;";

  connection.query(queryGetFaculties, (err, result) => {
    if (err) {
      return res.status(500).json("Internal Server Error");
    }
    res.json(result);
  });
});

router.get("/district", (req, res) => {
  const queryGetFaculties = "SELECT * FROM district;";

  connection.query(queryGetFaculties, (err, result) => {
    if (err) {
      return res.status(500).json("Internal Server Error");
    }
    res.json(result);
  });
});

module.exports = router;
