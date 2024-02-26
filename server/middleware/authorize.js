const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from headers or body
  console.log(req.body);
  const token = req.body.token;

  if (!token) {
    return res.status(405).json("Authorization Denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("user id : " + req.body.id);
    req.body.id = decoded.user.id; // Attach userId to request for further processing
    console.log("Decoded user id:", decoded);
    console.log("user id : " + req.body.id);
    next();
  } catch (err) {
    return res.status(406).json("Not Authorized");
  }
};
