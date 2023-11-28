exports.handleResponse = (res, code, message, data) => {
  var response = {};
  if (data) {
    response = {
      code: code,
      message: message,
      data: data,
    };
  } else {
    response = {
      code: code,
      message: message,
      data: [],
    };
  }
  return res.status(code).json(response);
};

/**
 * call this function to send response to user when error occuered at any level
 * @param {*} res response obj to return api
 * @param {*} err Error occured
 */

exports.handleError = (res, err) => {
  let { statusCode = 400, message, code = null } = err;
  if (code == 20404) {
    message = "The code has expired";
  }
  if (err.original) {
    message = err.original.message;
  }
  res.status(statusCode).json({
    code: statusCode,
    message: message,
  });
};
