const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/responses");

module.exports.verifyToken = (req, res, next) => {
  try {
    console.log("In JWT Helper");
    if ("authorization" in req.headers) {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            handleError(res, {
              statusCode: 400,
              message: "Token verification failed",
            });
          } else {
            req.company_id = payload.company_id;
            next();
          }
        });
      } else {
        handleError(res, { statusCode: 400, message: "Token not found" });
      }
    } else {
      handleError(res, { statusCode: 400, message: "Token header not found" });
    }
  } catch (err) {
    handleError(res, err);
  }
};
