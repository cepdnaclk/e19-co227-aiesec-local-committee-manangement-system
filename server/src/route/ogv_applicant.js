const express = require("express");
const router = express.Router();

const {
    requestBodyToFieldsAndValues,
    objectKeysSnakeToCamel,
} = require("../utils/parse");

const { connection, execQuery, execQueryWithValues } = require("../database/database");


//utility functions




//routes

router.get(`/members`, (req, res, next) => {

    execQuery(`SELECT id, preferred_name FROM member`)
        .then((rows) => {
            res.status(200).json(rows);
        })
        .catch((err) => {
            next(err);
        });

});

// get details(selected) of all
router.get(`/`, (req, res, next) => {

    execQuery("SELECT * FROM ApplicantDetailsInBrief")
        .then((rows) => {
            res.status(200).json(rows);
        })
        .catch((err) => {
            next(err);
        });

});

// get all details of one applicant
router.get(`/:id`, (req, res, next) => {

    execQuery(`CALL GetApplicantDetailsInDetail(${req.params.id})`)
        .then((rows) => {
            res.status(200).json(rows[0][0]);
        })
        .catch((err) => {
            next(err);
        });

});



// new applicant
router.post("/", (req, res, next) => {
    try {

        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        const query = `INSERT INTO ogv_applicants (${fields.toString()}) VALUES (${values.toString()})`;


        execQuery(query)
            .then((rows) => {
                res
                    .status(200)
                    .json({ message: "New OGV application Created!" });
            })

            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});

// update existing one
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

        const query = `UPDATE ogv_applicants  SET ${updateString} WHERE id=${values[0]};`;
        execQuery(query)
            .then((rows) => {
                res
                    .status(200)
                    .json({ message: "OGV application details updated successfully!" });
            })

            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});


//delete application
router.delete("/", (req, res, next) => {
    try {
        const deleteQuery = `DELETE FROM ogv_applicants WHERE id=${req.query.id}`;
        execQuery(deleteQuery)
            .then((rows) => {
                res.status(200).json({ message: "OGV application deleted Sucessfully" });
            })
            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }
});










module.exports = router;
