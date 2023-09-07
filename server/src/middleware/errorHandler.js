const errorHandler = (err, req, res, next) => {
  // ========== JWT Authentication Errors ==========

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    res.status(401).json({ error: "Unauthorized" });
  // ========== SQL Errors ==========
  else if (err.code === "ER_DUP_ENTRY")
    res.status(409).json({ message: "Conflict" });
  else if (err.code === "ER_NO_DEFAULT_FOR_FIELD")
    res.status(400).json({ message: "Bad Request" });
  // ========== Other Errors ==========
  else res.status(500).json("Internal Server Error");
};

module.exports = errorHandler;

/** Error Codes
 * 401 (Unauthorized) - Client provides no credentials or invalid credentials
 * 403 (Forbidden) - Client has valid credentials but not enough privileges to perform an action on a resource
 */
