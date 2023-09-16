const errorHandler = (err, req, res, next) => {
  // ========== JWT Authentication Errors ==========
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    return res.status(401).send("Unauthorized");

  // ========== SQL Errors ==========
  if (err.code === "ER_DUP_ENTRY")
    return res.status(409).send("Duplicate Entry");
  if (err.code === "ER_NO_DEFAULT_FOR_FIELD")
    return res.status(400).send("Missing Form Data");
  // ========== Other Errors ==========
  else return res.status(500).send("Internal Server Error");
};

module.exports = errorHandler;

/** Error Codes
 * 401 (Unauthorized) - Client provides no credentials or invalid credentials
 * 403 (Forbidden) - Client has valid credentials but not enough privileges to perform an action on a resource
 */
