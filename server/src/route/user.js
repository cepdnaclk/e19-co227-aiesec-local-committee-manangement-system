const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const connection = require("../database/database");

router.post("/login", (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    const queryFindUser = `SELECT Member_ID, User_password 
                                FROM MEMBERS_MAIN 
                                WHERE Personal_email = ?;`;

    connection.query(queryFindUser, [email], (err, result) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const user = result[0];

      if (password != user.User_password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Successful login, proceed with further actions
      const accessToken = jwt.sign(
        user.Member_ID,
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ message: "Login successful", accessToken: accessToken });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
