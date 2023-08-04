const errorLogger = (err, req, res, next) => {
  // TODO log to a log file instead of the console
  console.log(err?.message);

  // pass err to error handler function
  next(err);
};

module.exports = errorLogger;
