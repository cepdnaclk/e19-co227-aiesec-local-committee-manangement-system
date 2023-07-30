const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token == null)
    return res.sendStatus(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, memberId) => {
    if (err)
      return res
        .sendStatus(403)
        .json({ error: "Failed to authenticate token" });
    req.memberId = memberId;
    next();
  });
}

module.exports = authenticateToken;
