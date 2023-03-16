const { check, validationResult } = require("express-validator");

const userValidation = () => {
  return [
    check("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid E-mail"),
    check("firstName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("First Name must be between 1 and 50 characters long"),
    check("lastName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Last Name must be between 1 and 50 characters long"),
    check("password")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must be between 6 and 25 characters"),
  ];
};

const userValidate = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    const validationErrors = [];

    errs.array().map((err) => validationErrors.push(err.msg));

    validationErrors.push("Request not successfully processed");

    return res.status(400).json(validationErrors);
  }
  return next();
};

const updateUserValidation = () => {
  return [
    check("name")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Name must be between 1 and 50 characters long"),
  ];
};

const updateUserValidate = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    const validationErrors = [];

    errs.array().map((err) => validationErrors.push({ [err.param]: err.msg }));

    validationErrors.push({ message: "Request not successfully processed" });
    validationErrors.push({ success: false });

    const errorObject = Object.assign({}, ...validationErrors);

    return res.status(400).json(errorObject);
  }
  return next();
};

module.exports = {
  userValidation,
  userValidate,
  updateUserValidation,
  updateUserValidate,
};
