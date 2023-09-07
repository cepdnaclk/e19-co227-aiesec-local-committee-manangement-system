const errorLogger = (err, req, res, next) => {
  // TODO log to a log file instead of the console
  // JWT error object has no code attribute but a name attribute
  console.log("Code: ", err?.code || err?.name);
  console.log("Message: ", err?.message);

  // pass err to error handler function
  next(err);
};

module.exports = errorLogger;
