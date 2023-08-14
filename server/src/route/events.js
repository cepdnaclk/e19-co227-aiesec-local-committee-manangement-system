const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

// view events
router.get("/", (req, res, next) => {
    // if id present send only requested project details
  
    const getEvents = `SELECT * FROM lc_event';`;
  
    execQuery(getEvents)
      .then((rows) => {
        data = rows.map((row) => objectKeysSnakeToCamel(row));
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  });
  
  // edit, update, delete access only for LCVP IM
  
  // adding new event
  router.post("/", (req, res, next) => {
    try {
      console.log(req.body);
  
      const [fields, values] = requestBodyToFieldsAndValues(req.body);
  
      const addIgvAnswer = `INSERT INTO lc_event (${fields.toString()}) VALUES (${values.toString()})`;
  
      execQuery(addIgvAnswer)
        .then((rows) => {
          res
            .status(200)
            .json({ message: "New Event Added Successfully" });
        })
  
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  //edit igv questions
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
  
      const updateEventQuery = `UPDATE lc_event SET ${updateString} WHERE event_id=${req.query.eventId};`;
  
      execQuery(updateEventQuery)
        .then((rows) => {
          res.status(200).json({ message: "Event edited successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  // for deleting igv slots
  router.delete("/", (req, res, next) => {
    try {
      const deleteEvent = `DELETE FROM lc_event WHERE event_id=${req.query.eventId}`;
      execQuery(deleteEvent)
        .then((rows) => {
          res.status(200).json({ message: "Event Deleted Successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;
  