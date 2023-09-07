const changeCase = require("change-case");

const express = require("express");
const router = express.Router();

const { connection } = require("../database/database");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth");

let refreshTokens = [];

router.post("/login", (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    const queryFindUser = `SELECT id, email, passphrase, role_id, preferred_name FROM member WHERE email = ?;`;

    connection.query(queryFindUser, [email], (err, result) => {
      if (err) {
        console.log("Error during login:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = result[0];

      if (password != user.passphrase) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Successful login, proceed with further actions

      // Convert the keys from snake case to camel case and add to response
      const formattedUser = Object.keys(user).reduce((acc, key) => {
        // Remove password field
        if (key === "passphrase") return acc;
        acc[changeCase.camelCase(key)] = user[key];
        return acc;
      }, {});

      const accessToken = generateAccessToken(formattedUser);
      const refreshToken = generateRefreshToken(formattedUser);
      refreshTokens.push(refreshToken);

      res.json({
        message: "Login Successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
        ...formattedUser,
      });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/token", (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null)
      return res.sendStatus(401).json({ error: "Unauthorized" });
    if (refreshTokens.includes(refreshToken)) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, id) => {
        if (err) throw err;
        const accessToken = generateAccessToken(id);
        return res.status(200).json({ accessToken: accessToken });
      });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

module.exports = router;
