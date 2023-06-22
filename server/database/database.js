const mysql = require('mysql') 

const fs = require('fs')
const path = require('path')

const connection = mysql.createConnection({
host: "localhost",
user: 'root',
password: '',
database: 'LC_KANDY',
port: 3306,
multipleStatements: true
});

connection.connect((err => {
    if (err) {
        console.log(err);
        exit(1)
    }
        
    console.log('Connected to MySQL DB');
}));

// create database schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaScript = fs.readFileSync(schemaPath, 'utf8');
connection.query(schemaScript, (err) =>{
    if (err) {
        console.log(err);
        exit(1)
    }
    console.log('Created DB Schema');
});

// populate database
const dataPath = path.join(__dirname, 'data.sql');
const dataScript = fs.readFileSync(schemaPath, 'utf8');
connection.query(schemaScript, (err) =>{
    if (err) {
        console.log(err);
        exit(1)
    }
    console.log('Populated DB');
});

module.exports = connection;