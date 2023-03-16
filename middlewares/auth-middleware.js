const jwt = require("../utils/jwt");
const User = require("../models/user");

const isAuthourized = (roles) => async (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized Access",
    success: false,
  });
};

// Using auth now instead of the isAuthorized and
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData = await jwt.verify(token);

    const user = await User.findOne({ email: decodedData?.email });
    req.user = user;
    req.userId = decodedData?.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user?.role === "admin") {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized Access, you must be an admin",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized Access, you must be an admin",
      success: false,
    });
  }
};

module.exports = {
  isAuthourized,
  auth,
  isAdmin,
};
