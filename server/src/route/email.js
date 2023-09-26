const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { connection, execQuery } = require("../database/database");
const {
  sendSystemEmail,
  sendUserEmail,
  replacePlaceholders,
  oAuth2Client,
} = require("../utils/email_functions");

/*------------------ TEMPLATES ---------------------------------------*/

// create email template
router.post("/template/create", (req, res, next) => {

    try {
        const [fields, values] = [
            Object.keys(req.body),
            Object.values(req.body).map((value) => (value ? `'${value}'` : `NULL`)),
        ];

        const insertQuery = `INSERT INTO email_template (${fields.toString()}) VALUES (${values.toString()})`;

        execQuery(insertQuery)
            .then((rows) => {
                res.status(200).json({ msg: "successfully created" });
            })
            .catch((err) => {
                next(err);
            });
    } catch (e) {
        next(e);
    }
});

// delete email template
router.delete("/template/:name", (req, res, next) => {
  let sql = `DELETE FROM email_template WHERE name = '${req.params.name}'`;

  execQuery(sql)
    .then((rows) => {
      res.status(200).json({ msg: "successfully deleted" });
    })
    .catch((err) => {
      next(err);
    });
});

// get email template
router.get("/template/:name", (req, res, next) => {
    try {
        let sql = `SELECT * FROM email_template WHERE name = '${req.params.name}'`;

        execQuery(sql)
            .then((rows) => {
                res.status(200).json(rows[0]);
            })
            .catch((err) => {
                next(err);
            });
    } catch (e) {
        next(e);
    }
});

// update email template
router.put("/template/:name", (req, res, next) => {

    try {
        const [fields, values] = [
            Object.keys(req.body),
            Object.values(req.body).map((value) => (value ? `'${value}'` : `NULL`)),
        ];

        // Combine the two arrays into a single array.
        let updateString = "";

        for (let i = 0; i < fields.length; i++) {
            updateString += fields[i] + " = ";
            updateString += values[i] + ", ";
        }

        // remove last trailling ", "
        updateString = updateString.substring(0, updateString.length - 2);

        const query = `UPDATE email_template SET ${updateString} WHERE id='${req.params.id}';`;
        execQuery(query)
            .then((rows) => {
                res.status(200).json({ msg: "template updated" });
            })
            .catch((err) => {
                next(err);
            });
    } catch (err) {
        next(err);
    }

});

/*------------------ EMAILS THROUGH USERS ---------------------------------------*/

//google authentication for user's to access data
router.get("/auth", (req, res) => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://mail.google.com/", "openid", "email"],
    });
    res.status(200).send({ url: authUrl });
  } catch (err) {
    res.status(500).send("Google Authentication initialization error");
  }
});

// google redirects to this endpoint
router.get("/auth/callback", async (req, res) => {
  try {
    const response = await oAuth2Client.getToken(req.query.code);
    /*console.log("Token response:", response);*/
    const tokens = response.tokens;

    /*console.log("tokens: ",tokens);*/

    oAuth2Client.setCredentials(tokens);

    if (!tokens.id_token || tokens.id_token.split(".").length !== 3) {
      throw new Error("Invalid or missing id_token");
    }

    const decodedToken = jwt.decode(tokens.id_token);
    const userEmail = decodedToken.email;

    let rows = await execQuery(
      `SELECT email FROM user_gmail_data WHERE email = '${userEmail}' ;`
    );

    if (rows.length == 0) {
      await execQuery(
        `INSERT INTO user_gmail_data (email, accessToken, refreshToken, tokenExpiry) VALUES ('${userEmail}', '${tokens.access_token}', '${tokens.refresh_token}', '${tokens.expiry_date}')`
      );
    } else {
      await execQuery(
        `UPDATE user_gmail_data SET accessToken = '${tokens.access_token}', tokenExpiry = '${tokens.expiry_date}' WHERE email = '${userEmail}'`
      );
    }
    /* res.redirect('http://localhost:8081/email/sendemail');*/
    /*res.send("Authenticated successfully!");*/
    res.render("./gmailResponse", {
      code: 200,
      message1: "Authenticated successfully!",
      message2: "You can close this tab",
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    /* res.status(500).send("Authentication error.");*/
    res.render("./gmailResponse", {
      code: 500,
      message1: "Authentication error!",
      message2: "Please Try Again",
    });
  }
});

router.get("/sendEmail", async (req, res, next) => {
  try {
    const { userEmail, attachments, receiver, cc, bcc, subject, body } =
      req.body;
    const response = await sendUserEmail(
      userEmail,
      attachments,
      receiver,
      cc,
      bcc,
      subject,
      body
    );
    res.send("Email sent: " + response);
  } catch (err) {
    if (err.message === "User Email is not Authenticated.") {
      res.status(404).send(err.message);
    } else {
      next(err);
    }
  }
});

module.exports = router;
