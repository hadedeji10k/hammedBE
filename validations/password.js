const { check, validationResult } = require("express-validator");

const passwordValidation = () => {
  return [
    check("password")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("New password must be between 6 and 25 characters"),
  ];
};

const passwordValidate = (req, res, next) => {
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

const resetPasswordValidation = () => {
  return [
    check("oldPassword")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Old Password must be between 6 and 25 characters"),
    check("newPassword")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("New Password must be between 6 and 25 characters"),
  ];
};

const resetPasswordValidate = (req, res, next) => {
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
  passwordValidate,
  passwordValidation,
  resetPasswordValidate,
  resetPasswordValidation,
};
