const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

//get resources

// view all applications - recent ones first

router.get("/", (req, res, next) => {
  // id present send only requested user
  if (req.query.appId) {
    const getIgvApplication = `SELECT * FROM igv_application where app_id='${req.query.appId}';`;
    execQuery(getIgvApplication)
      .then((rows) => {
        data = objectKeysSnakeToCamel(rows[0]);
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    const getIgvApplication = `CALL GetAllApplications()`;

    execQuery(getIgvApplication)
      .then((rows) => {
        data = rows[0].map((row) => objectKeysSnakeToCamel(row));
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.get("/resources/", (req, res, next) => {
  execQuery("CALL GetApplicationResources()")
    .then((rows) => {
      data = rows[0].map((row) => objectKeysSnakeToCamel(row));
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/members/", (req, res, next) => {
  execQuery("CALL GetInChargeMemberList()")
    .then((rows) => {
      data = rows[0].map((row) => objectKeysSnakeToCamel(row));
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// add date into application
router.post("/", (req, res, next) => {
  try {
    console.log(req.body);

    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const igvApplicationAddQuery = `INSERT INTO igv_application (${fields.toString()}) VALUES (${values.toString()})`;

    execQuery(igvApplicationAddQuery)
      .then((rows) => {
        res.status(200).json({ message: "New Application Added Successfully" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// edit igv application

router.put("/", (req, res, next) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < fields.length; i++) {
      updateString += fields[i] + " = ";
      updateString += values[i] + ", ";
    }

    updateString = updateString.substring(0, updateString.length - 2);

    const updateIgvApplicationQuery = `UPDATE igv_application SET ${updateString} WHERE app_id=${req.query.appId};`;

    execQuery(updateIgvApplicationQuery)
      .then((rows) => {
        res.status(200).json({ message: "Application updated successfully" });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// delete application - delete access only for LCVP iGV

router.delete("/", (req, res, next) => {
  try {
    const deleteMemberQuery = `DELETE FROM igv_application WHERE app_id=${req.query.appId}`;
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

router.get("/log/", (req, res, next) => {
  // if id present send only requested project details

  const getInterviewLog = `CALL GetInterviewLog(${req.query.appId});`;

  execQuery(getInterviewLog)
    .then((rows) => {
      // console.log(rows);
      data = rows[0].map((row) => objectKeysSnakeToCamel(row));
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/log/", (req, res, next) => {
  execQuery(
    // Enclose the json array in '' to make it a valid json string
    `CALL UpdateInterviewLog('${JSON.stringify(req.body)}', ${
      req.query.appId
    });`
  )
    .then((rows) => {
      res.status(200).json({ message: "Log Updated Successfully" });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/upcoming/", (req, res, next) => {
  execQuery(
    // Enclose the json array in '' to make it a valid json string
    `CALL GetUpcomingInterviews(${req.query.id});`
  )
    .then((rows) => {
      data = rows[0].map((row) => objectKeysSnakeToCamel(row));
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
