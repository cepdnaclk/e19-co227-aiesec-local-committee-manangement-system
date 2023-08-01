const express = require("express");
const router = express.Router();

const authenticateToken = require("../authVerify");
const requestBodyToFieldsAndValues = require("../utils/parse");

const connection = require("../database/database");

// view all users
router.get("", authenticateToken, (req, res) => {
  const queryViewAllUsers = "SELECT id, email FROM member";

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

// view functional areas
router.get("/functional_area", authenticateToken, (req, res) => {
  const queryGetAllFunctionalAreas = "SELECT * FROM functional_area;";

  connection.query(queryGetAllFunctionalAreas, (err, result) => {
    //errors handling
    if (err) {
      console.error("Error during functional area retrieval:", err);
      return res.json({ message: "Internal Server Error" });
    }
    //for successful registrations
    console.log(result);
    res.json(result);
  });
});

// view departments
router.get("/department", authenticateToken, (req, res) => {
  const queryGetAllDepartments =
    "SELECT d.id, d.title, d.abbreviation FROM department as d " +
    "INNER JOIN valid_pair as v ON v.department_id = d.id " +
    "WHERE v.functional_area_id = '" +
    req.query.functionalAreaId +
    "';";
  console.log(JSON.stringify(req.query.functionalAreaId));
  // const queryGetAllFunctionalAreas = "SELECT * FROM functional_area;";

  connection.query(queryGetAllDepartments, (err, result) => {
    //errors handling
    if (err) {
      console.error("Error during functional area retrieval:", err);
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

router.post("", authenticateToken, (req, res) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const memberRegistrationQuery = `INSERT INTO member (${fields.toString()}) VALUES (${values.toString()})`;

    connection.query(memberRegistrationQuery, (err, result) => {
      //error handling
      if (err) {
        console.error("Error during member registration:", err);
        return res.json({ message: "Internal Server Error" });
      }

      //for successful registrations
      res.json({ message: "Member Registered Successfully" });
    });
  } catch (err) {}

  // res.send({ data: "Save User" });
});

router.put("", (req, res) => {
  res.send({ data: "Update User" });
});

router.delete("", (req, res) => {
  res.send({ data: "Delete User" });
});

module.exports = router;
