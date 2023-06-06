const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 8081


// parse application/x-www-form-urlencoded
//If the users send POST requests by submitting a form, 
//it will use application/x-www-form-urlencoded as the content-type to send the data. To parse that from the request body, we need to use the urlencoded() method
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Create connection to DB
const mysql = require('mysql') 
const connection = mysql.createConnection({
host: "localhost",
user: 'root',
password: 'SfF9B76*',
database: 'aisec_testdb',
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

app.get('/login', (req, res) => {
    try {
        const email = req.body.email 
        const password = req.body.password
        console.log(email, password)

        const queryFindUser = 'SELECT * FROM users WHERE email = ?;'

        connection.query(queryFindUser, [email], (err, result) => {
            if (err) {
                console.error('Error during login:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            const user = result[0];

            if (password != user.password) {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Close connection to database before exiting on keyboard interrup
process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

    connection.end()
    process.exit(0)
});