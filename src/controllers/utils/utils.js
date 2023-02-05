const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UsersJwt = require("../../models/users-jwt");

const validSession = (req, res) => {
    try {
        const token = req.headers["snake-x"];
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded;
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
}

module.exports = {
    validSession
}