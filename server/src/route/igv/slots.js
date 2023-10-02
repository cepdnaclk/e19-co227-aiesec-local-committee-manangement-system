const express = require("express");
const router = express.Router();
const { execQuery } = require("../../database/database");

router.get("/:expaId", (req, res, next) => {
  const getAllIgvSlots = `SELECT slotId, slotName, startDate, numOpenings FROM igv_slot WHERE expaId='${req.params.expaId}';`;
  execQuery(getAllIgvSlots)
    .then((rows) => res.status(200).json(rows))
    .catch((err) => next(err));
});

router.get("/:expaId/:slotId", (req, res, next) => {
  const getIgvSlot = `SELECT slotName, startDate, endDate, numOpenings FROM igv_slot WHERE expaId='${req.params.expaId}' AND slotId='${req.params.slotId}';`;
  execQuery(getIgvSlot)
    .then((rows) => {
      if (!rows.length)
        return res
          .status(404)
          .json({ message: "Requested slot does not exist" });

      return res.status(200).json(rows[0]);
    })
    .catch((err) => next(err));
});

router.post("/:expaId", (req, res, next) => {
  const { slotName, startDate, endDate, numOpenings } = req.body;
  execQuery(
    `INSERT INTO igv_slot (expaId, slotName, startDate, endDate, numOpenings)
    VALUES ('${req.params.expaId}', '${slotName}', '${startDate}', '${endDate}', '${numOpenings}'); 
    SELECT slotId, slotName, startDate, numOpenings FROM igv_slot 
    WHERE slotId=(SELECT LAST_INSERT_ID());`
  )
    .then((rows) => res.status(200).json(rows[1][0]))
    .catch((err) => next(err));
});

router.put("/:expaId/:slotId", (req, res, next) => {
  try {
    // Combine the two arrays into a single array.
    let updateString = "";

    for (let i = 0; i < Object.keys(req.body).length; i++) {
      updateString += `${Object.keys(req.body)[i]}  = `;
      updateString += `'${Object.values(req.body)[i]}', `;
    }
    updateString = updateString.substring(0, updateString.length - 2);

    const updateIgvProject = `UPDATE igv_slot SET ${updateString} 
    WHERE expaId='${req.params.expaId}' AND slotId='${req.params.slotId}';
    SELECT slotId, slotName, startDate, numOpenings FROM igv_slot WHERE slotId='${req.params.slotId}';`;
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

router.delete("/:expaId/:slotId", (req, res, next) => {
  execQuery(`DELETE FROM igv_slot WHERE slotId='${req.params.slotId}';`)
    .then((rows) => {
      res.status(200).json({ slotId: req.params.slotId, message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
