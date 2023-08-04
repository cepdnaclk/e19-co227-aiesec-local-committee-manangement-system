const errorHandler = (err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY")
    res.status(409).json({ message: "Conflict" });
  else if (err.code === "ER_NO_DEFAULT_FOR_FIELD")
    res.status(400).json({ message: "Bad Request" });
  else res.status(500).json("Internal Server Error");
};

module.exports = errorHandler;
