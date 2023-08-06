const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

// view all users
router.get("", (req, res) => {
  // id present send only requested user
  if (req.query.id) {
    const getUser = `SELECT * FROM member where id='${req.query.id}';`;
    execQuery(getUser)
      .then((rows) => {
        data = objectKeysSnakeToCamel(rows[0]);
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    const getUsers = `SELECT * FROM member;`;

    execQuery(getUsers)
      .then((rows) => {
        data = rows.map((row) => objectKeysSnakeToCamel(row));
        res.status(200).json(data);
      })
      .catch();
  }
});

// get required resources to fill out the register form (district, office ids, ... etc)
router.get("/resources", (req, res, next) => {
  execQuery("CALL GetMemberRegisterResources()")
    .then((rows) => {
      // console.log(rows);
      // TODO hardcoded for now, find a better way to do this
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

router.post("", (req, res, next) => {
  try {
    console.log(req.body);

    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const memberRegistrationQuery = `INSERT INTO member (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(memberRegistrationQuery)
      .then((rows) => {
        res.status(200).json({ message: "Ok" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

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

    const updateMemberQuery = `UPDATE member SET ${updateString} WHERE id=${values[0]};`;

    execQuery(updateMemberQuery)
      .then((rows) => {
        res.status(200).json({ message: "Ok" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

router.delete("", (req, res, next) => {
  try {
    const deleteMemberQuery = `DELETE FROM member WHERE id=${req.query.id}`;
    execQuery(deleteMemberQuery)
      .then((rows) => {
        res.status(200).json({ message: "Ok" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
