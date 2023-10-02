const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../../utils/parse");

const { connection, execQuery } = require("../../database/database");

router.get("/all/:id", (req, res, next) => {
  if (req?.params?.id === "admin") {
    const getIgvApplications = `CALL GetAllIGVApplicationsForAdmin();`;
    execQuery(getIgvApplications)
      .then((rows) => res.status(200).json(rows[0]))
      .catch((err) => next(err));
  } else {
    const getIgvApplications = `CALL GetAllIGVApplications(${req?.params?.id});`;

    execQuery(getIgvApplications)
      .then((rows) => res.status(200).json(rows[0]))
      .catch((err) => next(err));
  }
});

router.get("/opportunities", (req, res, next) => {
  execQuery("CALL GetIGVOpportunities()")
    .then((rows) => res.status(200).json(rows[0]))
    .catch((err) => next(err));
});

router.get("/members", (req, res, next) => {
  execQuery("CALL GetIGVMemberList()")
    .then((rows) => res.status(200).json(rows[0]))
    .catch((err) => next(err));
});

router.get("/log/:appId", (req, res, next) => {
  execQuery(`CALL GetInterviewLog('${req?.params?.appId}')`)
    .then((rows) => res.status(200).json(rows[0]))
    .catch((err) => next(err));
});

router.put("/log/:appId", (req, res, next) => {
  execQuery(
    `CALL UpdateInterviewLog('${JSON.stringify(req?.body)}', '${
      req?.params?.appId
    }'); CALL GetInterviewLog('${req?.params?.appId}');`
  )
    .then((rows) => res.status(200).json(rows[1]))
    .catch((err) => next(err));
});

router.get("/item/:appId", (req, res, next) => {
  execQuery(`SELECT * FROM igv_application WHERE appId='${req?.params?.appId}'`)
    .then((rows) => res.status(200).json(rows[0]))
    .catch((err) => next(err));
});

router.post("/item", (req, res, next) => {
  try {
    const [fields, values] = requestBodyToFieldsAndValues(req.body);
    const addIgvApplication = `INSERT INTO igv_application (${Object.keys(
      req.body
    ).toString()}) VALUES (${Object.values(req.body).map((value) => {
      if (!value) return "NULL";
      return `'${value}'`;
    })});CALL GetLatestIGVApplication();`;
    execQuery(addIgvApplication)
      .then((rows) => res.status(200).json(rows[1][0]))
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

router.put("/item/:appId", (req, res, next) => {
  try {
    const [fields, values] = [Object.keys(req.body), Object.values(req.body)];
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < fields.length; i++) {
      updateString += fields[i] + " = ";
      if (!values[i]) updateString += "NULL, ";
      else updateString += `'${values[i]}' , `;
    }

    updateString = updateString.substring(0, updateString.length - 2);

    const updateIgvApplicationQuery = `UPDATE igv_application SET ${updateString} WHERE appId=${req.params.appId};
    CALL GetIGVApplication(${req.params.appId})`;

    execQuery(updateIgvApplicationQuery)
      .then((rows) => {
        res.status(200).json(rows[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// delete application - delete access only for LCVP iGV
router.delete("/item/:appId", (req, res, next) => {
  try {
    const deleteMemberQuery = `DELETE FROM igv_application WHERE appId=${req.params.appId}`;
    execQuery(deleteMemberQuery)
      .then((rows) => {
        res.status(200).json({ appId: req.params.appId });
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

// router.get("/log/", (req, res, next) => {
//   // if id present send only requested project details

//   const getInterviewLog = `CALL GetInterviewLog(${req.query.appId});`;

//   execQuery(getInterviewLog)
//     .then((rows) => {
//       // console.log(rows);
//       data = rows[0].map((row) => objectKeysSnakeToCamel(row));
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

// router.put("/log/", (req, res, next) => {
//   execQuery(
//     // Enclose the json array in '' to make it a valid json string
//     `CALL UpdateInterviewLog('${JSON.stringify(req.body)}', ${
//       req.query.appId
//     });`
//   )
//     .then((rows) => {
//       res.status(200).json({ message: "Log Updated Successfully" });
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

// // /igv/interviews/upcoming/:memberid
// router.get("/upcoming/", (req, res, next) => {
//   execQuery(
//     // Enclose the json array in '' to make it a valid json string
//     `CALL GetUpcomingInterviews(${req.query.id});`
//   )
//     .then((rows) => {
//       data = rows[0].map((row) => objectKeysSnakeToCamel(row));
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

module.exports = router;
