const express = require("express");
const router = express.Router();
const { execQuery } = require("../../database/database");

router.get("", (req, res, next) => {
  const getAllIgvProjects = `SELECT expaId, projectName FROM igv_project;`;

  execQuery(getAllIgvProjects)
    .then((rows) => res.status(200).json(rows))
    .catch((err) => next(err));
});

router.get("/:expaId", (req, res, next) => {
  execQuery(`SELECT * FROM igv_project WHERE expaId = '${req.params.expaId}';`)
    .then((rows) => {
      if (!rows.length)
        return res
          .status(404)
          .json({ message: "Requested project does not exist" });

      return res.status(200).json(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("", (req, res, next) => {
  execQuery(
    `INSERT INTO igv_project VALUES (${Object.values(req.body).map(
      (value) => `'${value}'`
    )}); 
     SELECT expaId, projectName FROM igv_project WHERE expaId='${
       req.body.expaId
     }';`
  )
    .then((rows) => {
      res.status(200).json(rows[1][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:expaId", (req, res, next) => {
  try {
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < Object.keys(req.body).length; i++) {
      updateString += `${Object.keys(req.body)[i]}  = `;
      updateString += `'${Object.values(req.body)[i]}', `;
    }
    updateString = updateString.substring(0, updateString.length - 2);

    const updateIgvProject = `UPDATE igv_project SET ${updateString} WHERE expaId='${req.params.expaId}';
    SELECT expaId, projectName FROM igv_project WHERE expaId='${req.body.expaId}';`;
    execQuery(updateIgvProject)
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

router.delete("/:expaId", (req, res, next) => {
  execQuery(`DELETE FROM igv_project WHERE expaId='${req.params.expaId}';`)
    .then((rows) => {
      res.status(200).json({ expaId: req.params.expaId, message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
