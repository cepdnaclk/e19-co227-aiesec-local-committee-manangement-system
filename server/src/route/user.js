const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const { connection } = require("../database/database");

router.post("/login", (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    const queryFindUser = `SELECT id, email, passphrase, role_id, preferred_name 
                                FROM member 
                                WHERE email = ?;`;

    connection.query(queryFindUser, [email], (err, result) => {
      if (err) {
        console.error("Error during login:", err);
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
      const accessToken = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET);
      res.json({
        message: "Login successful",
        accessToken: accessToken,
        id: user.id,
        // TODO: snake to camel conversion of query
        preferredName: user.preferred_name,
        roleId: user.role_id,
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
