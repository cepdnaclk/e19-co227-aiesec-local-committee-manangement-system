const jwt = require("jsonwebtoken");

function getUserDataFromToken(req) {

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        const error = new Error();
        error.name = 'JsonWebTokenError';
        throw error;
    };

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded.id) {
        const error = new Error();
        error.name = 'JsonWebTokenError';
        throw error;
    };
    return decoded.id;
}


module.exports = {
    getUserDataFromToken,
}