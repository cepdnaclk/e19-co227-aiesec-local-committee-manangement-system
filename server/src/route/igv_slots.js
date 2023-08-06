const express = require("express");
const router = express.Router();

const {
  requestBodyToFieldsAndValues,
  objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery } = require("../database/database");

// view slots for each project - should be accessed within each project
router.get("", (req, res) => {
    // if id present send only requested project details
    
    //const getIgvProject = `SELECT * FROM igv_slot where project_name='${req.query.project_name}';`;
    const getIgvProject = `SELECT * FROM igv_slot where expa_id='${req.query.expa_id}';`;
    execQuery(getIgvProject)
    .then((rows) => {
        data = objectKeysSnakeToCamel(rows[0]);
        res.status(200).json(data);
    })
    .catch((err) => {
        next(err);
    });

  });

// edit, update, delete access only for iGV LCVP 

// adding new slot per each project - should be accessed within each project
router.post("", (req, res, next) => {

    try {
        console.log(req.body);
        
        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        
        const addIgvSlots = `INSERT INTO igv_slot (${fields.toString()}) VALUES (${values.toString()})`;
        
        execQuery(addIgvSlots)
        .then((rows) => {
            res.status(200).json({message: "New iGV Project Slot Added Successfully" });
        })

        .catch((err) => {
          next(err);
        });

    } catch (err) {
      next(err);
    }
}); 

//edit igv project slot
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
  
      const updateIgvSlotQuery = `UPDATE igv_slot SET ${updateString} WHERE expa_id=${values[0]};`;
  
      execQuery(updateIgvSlotQuery)
        .then((rows) => {
          res.status(200).json({ message: "iGV Project slot edited successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  });

// for deleting igv slots
router.delete("", (req, res, next) => {
try {
    const deleteIgvSlotQuery = `DELETE FROM igv_slot WHERE expa_id=${req.query.expa_id}`;
    execQuery(deleteIgvSlotQuery)
    .then((rows) => {
        res.status(200).json({ message: "iGV Project Slot Deleted Successfully" });
    })
    .catch((err) => {
        next(err);
    });
} catch (err) {
    next(err);
}
});
  
module.exports = router;
