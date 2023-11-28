const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/responses");

module.exports.verifyToken = (req, res, next) => {
  try {
    // console.log("In JWT Helper");
    if ("authorization" in req.headers) {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            throw new Error("Token verification failed");
          } else {
            req.company_id = payload.company_id;
            next();
          }
        });
      } else {
        throw new Error("Token not found");
      }
    } else {
      throw new Error("Token header not found");
    }
  } catch (err) {
    handleError(res, err);
  }
};
