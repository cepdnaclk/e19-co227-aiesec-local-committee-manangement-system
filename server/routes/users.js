const express = require("express");
const router = express.Router();

const authenticateToken = require("../authVerify");

const connection = require("../database/database");

// view all users
router.get("", authenticateToken, (req, res) => {
  const queryViewAllUsers =
    "SELECT Member_ID AS id, Personal_email AS email FROM MEMBERS_MAIN";

  connection.query(queryViewAllUsers, (err, result) => {
    //errors handling
    if (err) {
      console.error("Error during member retrieval:", err);
      return res.json({ message: "Internal Server Error" });
    }
    //for successful registrations
    console.log(result);
    res.json(result);
  });
});

// view user specified by id
router.get(":id", (req, res) => {
  // const queryViewAllUsers = "SELECT Member_ID AS id, Personal_email AS email FROM MEMBERS_MAIN WHERE Member_ID=" + req.params.id;

  // connection.query(queryViewAllUsers, (err, result) => {
  //   //errors handling
  //   if (err) {
  //     console.error('Error during member retrieval:', err);
  //     return res.json({ message: 'Internal Server Error' });
  //   }
  //   //for successful registrations
  //   console.log(result)
  //   res.json(result)
  // });
  console.log(req.params.id);
});

router.post("", (req, res) => {
  res.send({ data: "Save User" });
});

router.put("", (req, res) => {
  res.send({ data: "Update User" });
});

router.delete("", (req, res) => {
  res.send({ data: "Delete User" });
});

module.exports = router;
