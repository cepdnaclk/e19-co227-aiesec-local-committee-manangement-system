const express = require("express");
const router = express.Router();

const {
    requestBodyToFieldsAndValues,
    objectKeysSnakeToCamel,
} = require("../../utils/parse");

const { connection, execQuery } = require("../../database/database");



module.exports = router;