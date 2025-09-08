const axios = require('axios');

// Logging Middleware
module.exports = function logger(req, res, next) {
  // Helper to send logs
  req.log = async function(level, pkg, message) {
    try {
      await axios.post('http://20.244.56.144/evaluation-service/logs', {
        stack: 'backend',
        level,
        package: pkg,
        message
      }, {
        headers: {
          Authorization: 'Bearer <YOUR_TOKEN_HERE>' // Replace with your actual token
        }
      });
    } catch (err) {
      // Fails silently, do not use console.log
    }
  };
  next();
};
