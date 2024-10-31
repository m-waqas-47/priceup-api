const mongoose = require('mongoose');

const requestLogsSchema = new mongoose.Schema({  
    ip: { type: String, required: true },
    endpoint: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    expiryAt: { type: Date, required: true  }  // Field for dynamic expiry time
});

module.exports = mongoose.model('request-logs', requestLogsSchema);