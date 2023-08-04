const connection = require("../database/database");

const getQuery = (query) => {
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;

      return [200, result[0]];
    });
  } catch (err) {
    console.error("Failed getQuery: ", err.code);
    return [500, "Internal Server Error"];
  }
};

module.exports = { getQuery };
