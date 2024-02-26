const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
    console.log("id - " + user_id);
    const payload = {
        user: {
            id: user_id
        }
    };
    console.log("inside : " + jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }));
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
