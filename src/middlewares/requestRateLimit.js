const RequestLogService = require("@services/requestLog");

const rateLimitMiddleware = (
  expiryTime = 60 * 60 * 1000,
  requestLimit = 50
) => {
  return async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Convert IPv6 loopback (::1) to IPv4 (127.0.0.1)
    if (ip === "::1") {
      ip = "127.0.0.1";
    }
    const endpoint = req.originalUrl; // Get requested endpoint

    // Calculate time frame based on expiryTime
    const timeAgo = new Date(Date.now() - expiryTime);

    try {
      // Step 1: Delete expired records for the same IP and endpoint
      await RequestLogService.deleteAll({
        ip,
        endpoint,
        expiryAt: { $lt: new Date() }, // Check if expiryDate is in the past
      });

      // Count requests for this IP within the expiry time
      const requestCount = await RequestLogService.count({
        ip,
        endpoint,
        timestamp: { $gte: timeAgo },
      });

      // If request count exceeds the limit, send a rate limit error
      if (requestCount >= requestLimit) {
        return res
          .status(429)
          .json({ error: "Too many requests. Please try again later." });
      }

      // Otherwise, log the current request with an expiration timestamp
      await RequestLogService.create({
        ip,
        endpoint,
        timestamp: new Date(), // Record the timestamp of this request
        expiryAt: new Date(Date.now() + expiryTime), // Set custom expiry
      });

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = rateLimitMiddleware;
