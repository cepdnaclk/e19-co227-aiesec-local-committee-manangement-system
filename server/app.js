const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8081

// const cors = require('cors');
// app.use(cors)

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// parse application/x-www-form-urlencoded
//If the users send POST requests by submitting a form, 
//it will use application/x-www-form-urlencoded as the content-type to send the data. To parse that from the request body, we need to use the urlencoded() method
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Create connection to DB
const mysql = require('mysql') 
const connection = mysql.createConnection({
host: "localhost",
user: 'root',
password: 'SfF9B76*',
database: 'LC_KANDY',
// port: 3000
});

// Connect to DB
connection.connect(function(err) {
if (!err) {
console.log('Connected to the MySQL server.');
}
else if (err)
{
console.log('Timeout: ' + err.message);
process.exit(1);
}
});

// API ENDPOINTS

app.get('/', (req, res) => {
//   res.send('Hello World!')
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err
  
    res.send(JSON.stringify(rows))
  })
})

// app.get('/insert', (req, res) => {
// //   res.send('Hello World!')
//   connection.query('INSERT INTO users VALUES (\'jane@example.com\', \'456\');', (err, rows, fields) => {
//     if (err) throw err
  
//     res.send(JSON.stringify(rows))
//   })
// })

// login API
app.post('/login', (req, res) => {
    try {
        const email     = req.body.email 
        const password  = req.body.password
        console.log(email, password)

        const queryFindUser =`SELECT User_password 
                              FROM MEMBERS_MAIN 
                              WHERE Personal_email = ?;`

        connection.query(queryFindUser, [email], (err, result) => {
            if (err) {
                console.error('Error during login:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            const user = result[0];

            if (password != user.User_password) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Successful login, proceed with further actions

            res.json({ message: 'Login successful' });
        });

    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//Member registration API
app.post('/memberRegistration',(req, res) => {

  try {

      //login details
      const personalEmail     = req.body.personalEmail
      const userPassword      = req.body.userPassword
      
      //user details
      const fullName          = req.body.fullName
      const preferredName     = req.body.preferredName
      const functionID        = req.body.functionID
      const deptID            = req.body.deptID
      const dateOfJoin        = req.body.dateOfJoin
      const positionID        = req.body.positionID
      const contactNumber     = req.body.contactNumber
      const aiesecEmail       = req.body.aiesecEmail
      const gender            = req.body.gender
      const nicNumber         = req.body.nicNumber
      const birthdate         = req.body.birthdate
      const facebookLink      = req.body.facebookLink
      const linkedInLink      = req.body.linkedInLink
      const instagramLink     = req.body.instagramLink
      const facultyID         = req.body.facultyID
      const batch             = req.body.batch
      const uniRegNo          = req.body.uniRegNo
      const schoolName        = req.body.schoolName
      const homeAddress       = req.body.homeAddress
      const homeContactNumber = req.body.homeContactNumber
      const district          = req.body.district
      const photoLink         = req.body.photoLink
      const boardingAddress   = req.body.boardingAddress
      
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
        boardingAddress

       ]

      const memberRegistrationQuery = `
      
      INSERT INTO MEMBERS_MAIN (
        Personal_email,
        User_password

        Full_Name,
        Preferred_Name,
        Function_id,
        Dept_id,
        Date_of_join,
        Position_id,
        Contact_num,
        AIESEC_email,
        Gender,
        NIC_Number,
        Birth_date,
        Facebook_link,
        LinkedIN_link,
        Instagram_link,
        Faculty_id,
        Batch,
        UniRegNo,
        School_name,
        Home_address,
        Home_contact,
        District,
        Photo_link,
        Boarding_address,

        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        
        )`

        connection.query(memberRegistrationQuery, [userDetailEntry], (err, result) => {
          //errors handling
          if (err) {
            console.error('Error during member registration:', err);
            return res.json({ message: 'Internal Server Error' });
          }


          //for successful registrations
          res.json({message : "Member Registered Successfully"})

        });
          
  } catch (error) {
    
  }

})

//start listening to the port - start the app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Close connection to database before exiting on keyboard interrup
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

    connection.end()
    process.exit(0)
});
