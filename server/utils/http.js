// TODO - A skeleton function to handle sql queries

import { ReasonPhrases, StatusCodes } from "http-status-codes";

const connection = require("./database/database");

function handleSQLRequest(query, req, res, success) {
  connection.query(query, (err, result) => {
    if (err) {
      console.log("Error: ", err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  });
}

module.exports = handleRequest;
