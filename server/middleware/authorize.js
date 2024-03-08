const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.body.token;

  if (!token) {
    return res.status(405).json("Authorization Denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.id = decoded.user.id;
    next();
  } catch (err) {
    return res.status(406).json("Not Authorized");
  }
};
