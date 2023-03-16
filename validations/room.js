const { check, validationResult } = require("express-validator");

const roomValidation = () => {
  return [
    check("capacity")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Room's capacity is required"),
    check("price")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Room's price is required"),
    check("hotelId")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Hotel ID is required"),
  ];
};

const roomValidate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const validationErrors = [];

    errs.array().map((err) => validationErrors.push(err.msg));

    validationErrors.push("Request not successfully processed");

    return res.status(400).json(validationErrors);
  }
  return next();
};

const hotelValidation = () => {
  return [
    check("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Hotel's name is required"),
    check("description")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Hotel's description is required"),
    check("location")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Hotel's location is required"),
    check("star")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Hotel's star rating is required"),
  ];
};

const hotelValidate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const validationErrors = [];

    errs.array().map((err) => validationErrors.push(err.msg));

    validationErrors.push("Request not successfully processed");

    return res.status(400).json(validationErrors);
  }
  return next();
};

const commentValidation = () => {
  return [
    check("description")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Comment must be at least 2 characters long"),
  ];
};

const commentValidate = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    const validationErrors = [];

    errs.array().map((err) => validationErrors.push(err.msg));

    validationErrors.push("Request not successfully processed");

    return res.status(400).json(validationErrors);
  }
  return next();
};

module.exports = {
  roomValidate,
  roomValidation,
  commentValidation,
  commentValidate,
  hotelValidation,
  hotelValidate,
};
