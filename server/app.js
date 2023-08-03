require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8081;

const jwt = require("jsonwebtoken");

// Enable CORS for all routes. KEEP ABOVE ANY ROUTES IMPORTS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );
  next();
});

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split(" ")[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, memberId) => {
//     if (err) return res.sendStatus(403);
//     req.memberId = memberId;
//     next();
//   });
// };
// parse application/json
app.use(bodyParser.json());

const userRoute = require("./routes/user");
app.use("/users", userRoute);

const termRoute = require("./routes/term");
app.use("/term", termRoute);

const resourceRoute = require("./routes/resource");
app.use("/resource", resourceRoute);

// parse application/x-www-form-urlencoded
//If the users send POST requests by submitting a form,
//it will use application/x-www-form-urlencoded as the content-type to send the data. To parse that from the request body, we need to use the urlencoded() method
app.use(bodyParser.urlencoded({ extended: true }));

const connection = require("./database/database");

// Authenticate Login
app.post("/login", (req, res) => {
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

//Member registration API
app.post("/users/add", (req, res) => {
  // TODO - check if user with email already exists and send response with 403 status code

  try {
    //user details
    const fullName = req.body.fullName;
    const preferredName = req.body.preferredName;
    const functionID = req.body.functionID;
    const deptID = req.body.deptID;
    const dateOfJoin = req.body.dateOfJoin;
    const positionID = req.body.positionID;
    const contactNumber = req.body.contactNumber;
    const aiesecEmail = req.body.aiesecEmail;
    const gender = req.body.gender;
    const nicNumber = req.body.nicNumber;
    const birthdate = req.body.birthdate;
    const facebookLink = req.body.facebookLink;
    const linkedInLink = req.body.linkedInLink;
    const instagramLink = req.body.instagramLink;
    const facultyID = req.body.facultyID;
    const batch = req.body.batch;
    const uniRegNo = req.body.uniRegNo;
    const schoolName = req.body.schoolName;
    const homeAddress = req.body.homeAddress;
    const homeContactNumber = req.body.homeContactNumber;
    const district = req.body.district;
    const photoLink = req.body.photoLink;
    const boardingAddress = req.body.boardingAddress;

    const userDetailEntry = [
      personalEmail,
      userPassword,
      fullName,
      preferredName,
      functionID,
      deptID,
      dateOfJoin,
      positionID,
      contactNumber,
      aiesecEmail,
      gender,
      nicNumber,
      birthdate,
      facebookLink,
      linkedInLink,
      instagramLink,
      facultyID,
      batch,
      uniRegNo,
      schoolName,
      homeAddress,
      homeContactNumber,
      district,
      photoLink,
      boardingAddress,
    ];

    connection.query(
      memberRegistrationQuery,
      [userDetailEntry],
      (err, result) => {
        //errors handling
        if (err) {
          console.error("Error during member registration:", err);
          return res.json({ message: "Internal Server Error" });
        }

        //for successful registrations
        res.json({ message: "Member Registered Successfully" });
      }
    );
  } catch (error) {}
});

// TODO: /users/view/ - single user view

app.get("/users/view/all", (req, res) => {});

// TODO: /users/info/dept
// /users/info/func
// /users/info/pos

//start listening to the port - start the app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Close connection to database before exiting on keyboard interrup
process.on("SIGINT", function () {
  console.log("Caught interrupt signal");

  connection.end();
  process.exit(0);
});
