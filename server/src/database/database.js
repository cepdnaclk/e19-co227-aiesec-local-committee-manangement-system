const mysql = require("mysql");
const fs = require("fs").promises;  // Promises-based version of 'fs' module
const path = require("path");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "LC_KANDY",
    port: 3306,
    multipleStatements: true,
});

const connectToDB = async () => {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            console.log("\x1b[32m%s\x1b[0m", "Connected to MySQL DB");
            resolve();
        });
    });
};


const logFileModificationTime = async (filePath) => {
    const stats = await fs.stat(filePath);
    console.log(`File modified on: ${stats.mtime}`);
};

const executeScriptFromFile = async (filePath, operationName) => {
    console.log(`Starting ${operationName}... `);
    const script = await fs.readFile(filePath, "utf8");
    await execQuery(script);
    console.log(`${operationName} completed.`);
};

const initDatabase = async () => {
    try {
        await connectToDB();

        const schemaPath = path.join(__dirname, "schema.sql");
        await logFileModificationTime(schemaPath);
        await executeScriptFromFile(schemaPath, "DB Schema Creation");

        const dataPath = path.join(__dirname, "data.sql");
        await executeScriptFromFile(dataPath, "DB Population");

        const procedurePath = path.join(__dirname, "procedure.sql");
        await executeScriptFromFile(procedurePath, "Procedures Addition");

        const procedurePath = path.join(__dirname, "view.sql");
        await executeScriptFromFile(procedurePath, "Views Addition");

        console.info("\x1b[32m%s\x1b[0m", "Database Initialization Done!");

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};



const execQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, rows) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

initDatabase();

module.exports = { connection, execQuery };
