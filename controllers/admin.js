const User = require("../models/user");
const paginate = require("express-paginate");

// GET ALL USER
const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).exec();

    return res.status(201).json({
      message: "Users Fetched Successfully!",
      data: users,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET USER BY QUERY (PAGINATION)
const getAllUserByQuery = async (req, res) => {
  try {
    let limit = req.query.limit || process.env.LIMIT;
    let skip = req.query.skip;

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();
    const totalCountOfUsers = await User.countDocuments({});

    const totalPages = Math.ceil(totalCountOfUsers / limit);

    return res.status(201).json({
      message: "Users Fetched Successfully!",
      nextPage: paginate.hasNextPages(req)(totalPages),
      data: users,
      totalCountOfUsers,
      totalPages,
      currentPage: req.query.page,
      pages: paginate.getArrayPages(req)(3, totalPages)(req.query.page),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET A USER
const getOneUser = async (req, res) => {
  try {
    let userId = req.params.id || req.users._id;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User Fetched Successfully!",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
// GET A USER WITHOUT POPULATING
const getOneUserWithoutPopulating = async (req, res) => {
  try {
    let userId = req.params.id || req.users._id;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User Fetched Successfully!",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const totalNumberOfUser = await User.countDocuments({});

    let data = {
      totalNumberOfUser,
    };

    return res.status(201).json({
      message: "Admin Dashboard Info Fetched Successfully!",
      data,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  getAllUser,
  getAllUserByQuery,
  getOneUser,
  adminDashboard,
  getOneUserWithoutPopulating,
};
