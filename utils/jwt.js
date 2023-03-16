const jwt = require("jsonwebtoken");

const sign = (payload, token) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, token, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = { sign, verify };
