const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { execQuery } = require("../database/database");

// get users
router.get("/", (req, res, next) => {
  if (req.query.id) {
    execQuery(`SELECT * FROM member WHERE id=${req.query.id}`)
      .then((rows) => {
        data = objectKeysSnakeToCamel(rows[0]);
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    execQuery("CALL GetAllMembers()")
      .then((rows) => {
        data = rows[0].map((row) => objectKeysSnakeToCamel(row));
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
});

// get required resources to fill out the register form (district, office ids, ... etc)
router.get("/resources/", (req, res, next) => {
  execQuery("CALL GetMemberRegisterResources()")
    .then((rows) => {
      // TODO: result is mapped into object by hardcoding for now, find a better way to do this
      const result = {
        districts: rows[0],
        frontOffices: rows[1],
        backOffices: rows[2],
        roles: rows[3],
      };
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
});

//only for LCVP PM and People work in PM back office

//add new member
router.post("/", (req, res, next) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const memberRegistrationQuery = `INSERT INTO member (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(memberRegistrationQuery)
      .then((rows) => {
        res.status(200).json({ message: "New Member created successfully" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//update member details
router.put("/", (req, res, next) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < fields.length; i++) {
      updateString += fields[i] + " = ";
      updateString += values[i] + ", ";
    }

    // remove last trailling ", "
    updateString = updateString.substring(0, updateString.length - 2);

    const updateMemberQuery = `UPDATE member SET ${updateString} WHERE id=${values[0]};`;

    execQuery(updateMemberQuery)
      .then((rows) => {
        res
          .status(200)
          .json({ message: "Member details updated successfully" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//delete members - access only for LCVP PM
router.delete("/", (req, res, next) => {
  try {
    const deleteMemberQuery = `DELETE FROM member WHERE id=${req.query.id}`;
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
