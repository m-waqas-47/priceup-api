const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/responses");

module.exports.verifyToken = (req, res, next) => {
  try {
    console.log("In JWT Helper");
    if ("authorization" in req.headers) {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(" ")[1];
        jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5NjI1NjkzMiwiaWF0IjoxNjk2MjU2OTMyfQ.SeWHcWCG2ZPR-aYmoaVe4sjv_KhiTf-Vzu4Lpd-6SNk', (err, payload) => {
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
