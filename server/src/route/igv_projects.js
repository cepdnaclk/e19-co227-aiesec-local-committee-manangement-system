const requestBodyToFieldsAndValues = require("../utils/parse");

const express = require("express");
const router = express.Router();

const { execQuery } = require("../database/database");

//API for adding new iGV project
router.post("", (req, res, next) => {

    try {
        const [fields, values] = requestBodyToFieldsAndValues(req.body);
        
        const addIgvProject = `INSERT INTO igv_project (${fields.toString()}) VALUES (${values.toString()})`;
        
        execQuery(addIgvProject)
        .then(() => {})
    }

    catch{
        
    }

}); 