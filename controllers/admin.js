const User = require("../models/user");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Booking = require("../models/booking");

const adminDashboard = async (req, res) => {
  try {
    const totalNumberOfUser = await User.countDocuments({});
    const totalNumberOfRooms = await Room.countDocuments({});
    const totalNumberOfHotels = await Hotel.countDocuments({});
    const totalNumberOfBookings = await Booking.countDocuments({});

    let data = {
      totalNumberOfUser,
      totalNumberOfRooms,
      totalNumberOfHotels,
      totalNumberOfBookings,
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

// GET BOOKINGS
const getBookings = async (req, res) => {
  try {
    const currentPage = parseInt(req.query?.pageNumber || "1");
    const limit = parseInt(req.query?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const totalCountOfBookings = await Booking.countDocuments({});

    const totalPages = Math.ceil(totalCountOfBookings / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({
        path: "room",
        populate: {
          path: "hotel",
          model: "Hotel",
        },
      })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    return res.status(201).json({
      message: "Bookings Fetched Successfully!",
      result: bookings,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCountOfBookings,
      hasPrevious,
      hasNext,
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
  adminDashboard,
  getBookings,
};
