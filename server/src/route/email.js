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

// get email template by frontOfficeId or backOfficeId
router.get("/template", (req, res, next) => {
  try {
    // console.log(req);
    // if (!req.query.frontOfficeId && !req.query.backOfficeId) {
    if (!req?.query?.officeId) {
      return res.status(400).send({
        message:
          "Either frontOfficeId or backOfficeId must be provided in the query parameters.",
      });
    }

    execQuery(`SELECT * FROM email_template WHERE officeId = ?`, [
      // req.query.frontOfficeId || req.query.backOfficeId,
      req.query.officeId,
    ])
      .then((rows) => {
        // If no rows are found return empty rows
        // if (rows.length === 0) {
        //   return res
        //     .status(404)
        //     .send({ message: "No template found for the provided officeId." });
        // }

        // Generalized JSON parsing for multiple rows
        rows = rows.map((data) => {
          for (let key in data) {
            try {
              let parsedData = JSON.parse(data[key]);
              data[key] = parsedData;
            } catch (e) {
              // If it's not parseable JSON, do nothing and leave the original value
            }
          }
          return data;
        });

        res.status(200).json(rows);
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
});

// get email template by id
router.get("/template/:id", (req, res, next) => {
  try {
    let sql = `SELECT * FROM email_template WHERE id = ?`;

    execQuery(sql, [req.params.id])
      .then((rows) => {
        if (rows.length > 0) {
          let data = rows[0];

          // Generalized JSON parsing
          for (let key in data) {
            try {
              let parsedData = JSON.parse(data[key]);
              data[key] = parsedData;
            } catch (e) {
              // If it's not parseable JSON, do nothing and leave the original value
            }
          }

          res.status(200).json(data);
        } else {
          res.status(404).send("Template not found.");
        }
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
});

// create email template
router.post("/template/create", (req, res, next) => {
  try {
    // console.log(req.body);
    const fields = Object.keys(req.body);

    const values = Object.values(req.body).map((value) => {
      // Check if the value is an array, and if so, JSON.stringify it
      if (Array.isArray(value)) {
        return JSON.stringify(value);
      } else if (value) {
        return value;
      } else {
        return null;
      }
    });

    // Create a placeholder string: ?,?,?... based on the number of fields
    const placeholders = new Array(fields.length).fill("?").join(",");

    const insertQuery = `INSERT INTO email_template (${fields.toString()}) VALUES (${placeholders});
    SELECT id, name FROM email_template WHERE id =(SELECT LAST_INSERT_ID())`;

    execQuery(insertQuery, values)
      .then((rows) => {
        // return the newly created data
        // console.log(rows[1][0]);
        res.status(200).json(rows[1][0]);
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
});

// delete email template
router.delete("/template/:id", (req, res, next) => {
  let sql = `DELETE FROM email_template WHERE id = '${req.params.id}'`;

  execQuery(sql)
    .then((rows) => {
      // console.log("deleted");
      res.status(200).json({ id: req.params.id });
    })
    .catch((err) => {
      next(err);
    });
});

// update email template
router.put("/template/:id", (req, res, next) => {
  try {
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    // .map((value) => {
    //   if (typeof value === "object") {
    //     return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    //   } else {
    //     return value ? `'${value.replace(/'/g, "''")}'` : `NULL`;
    //   }
    // });

    let updates = [];
    for (let i = 0; i < fields.length; i++) {
      // updates.push(`${fields[i]} = ${values[i]}`);
      if (
        fields[i] === "cc" ||
        fields[i] === "bcc" ||
        fields[i] === "attachments"
      )
        updates.push(`${fields[i]} = '${JSON.stringify(values[i])}'`);
      else updates.push(`${fields[i]} = '${values[i]}'`);
    }

    let updateString = updates.join(", ");

    const query = `UPDATE email_template SET ${updateString} WHERE id='${req.params.id}';
    SELECT id, name FROM email_template WHERE id='${req.params.id}';`;
    execQuery(query)
      .then((rows) => {
        res.status(200).json(rows[1][0]);
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
    const { from, attachments, to, cc, bcc, subject, body } = req.body;
    const response = await sendUserEmail(
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      attachment
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
