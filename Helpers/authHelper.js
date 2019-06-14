// REQUIRING DEPENDENCIES.
const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");

// REQUIRING EXTERNAL FILES.
const Config = require("../config/conn");

// TOKEN VERIFICATION SCRIPT.
module.exports = {
  VerifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "NO Authorization" });
    }
    const token = req.cookies.auth || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "No token provided" });
    }
    return jwt.verify(token, Config.secret, (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Token has Expired, Login in again.",
            token: null
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  }
};
