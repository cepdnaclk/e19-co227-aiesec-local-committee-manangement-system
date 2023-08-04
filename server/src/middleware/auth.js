const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token == null) return res.sendStatus(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userId) => {
    if (err) return res.sendStatus(403).json({ error: "Forbidden" });
    req.userId = userId;
    next();
  });
}

module.exports = authenticateToken;
