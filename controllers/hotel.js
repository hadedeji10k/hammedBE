const Hotel = require("../models/hotel");
const Comment = require("../models/comment");

// GET ALL HOTEL
const getAllHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 }).exec();

    return res.status(201).json({
      message: "Hotels fetched Successfully!",
      data: hotels,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET HOTELS BY QUERY (PAGINATION)
const getAllHotelByQuery = async (req, res) => {
  try {
    const currentPage = parseInt(req.query?.pageNumber || "1");
    const limit = parseInt(req.query?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const totalCountOfHotels = await Hotel.countDocuments({});

    const totalPages = Math.ceil(totalCountOfHotels / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const hotels = await Hotel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    res.status(201).json({
      message: "Hotels Fetched Successfully!",
      result: hotels,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCountOfHotels,
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

// GET TOP HOTELS
const getTopHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ star: -1 }).limit(5).exec();

    res.status(201).json({
      message: "Hotels Fetched Successfully!",
      result: hotels,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET A HOTEL
const getOneHotel = async (req, res) => {
  try {
    let hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Hotel Fetched Successfully!",
      data: hotel,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ADD A NEW HOTEL
const addHotel = async (req, res) => {
  try {
    const newHotel = new Hotel({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      image: req.body.image,
      star: Number(req.body.star),
      createdBy: req.userId,
    });

    await newHotel.save();
    return res.status(201).json({
      message: "Hotel added successfully",
      data: newHotel,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// UPDATE HOTEL
const updateHotel = async (req, res) => {
  try {
    let hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        success: false,
      });
    }

    const data = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      star: Number(req.body.star),
    };

    await Hotel.findByIdAndUpdate(hotelId, data);

    return res.status(201).json({
      message: "Hotel updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// REMOVE A HOTEL
const deleteHotel = async (req, res) => {
  try {
    let hotelId = req.params.id;
    const hotelToDelete = await Hotel.findByIdAndDelete(hotelId);

    if (!hotelToDelete) {
      return res.status(404).json({
        message: "Hotel not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Hotel deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ADD A NEW COMMENT
const addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      user: req.userId,
      description: req.body.description,
      hotel: req.body.hotelId,
    });

    await newComment.save();
    return res.status(201).json({
      message: "Comment added successfully",
      data: newComment,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// UPDATE COMMENT
const updateComment = async (req, res) => {
  try {
    let commentId = req.params.id;

    const comment = await Comment.findById(commentId).populate("user").exec();

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    if (comment?.user?._id.toString() !== req.userId) {
      return res.status(404).json({
        message: "You are not the owner of this comment.",
        success: false,
      });
    }

    const data = {
      description: req.body.description,
    };

    await Comment.findByIdAndUpdate(commentId, data);

    return res.status(201).json({
      message: "Comment updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// REMOVE A COMMENT
const deleteComment = async (req, res) => {
  try {
    let commentId = req.params.commentId;

    const comment = await Comment.findById(commentId).populate("user").exec();

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    if (comment?.user?._id.toString() !== req.userId) {
      return res.status(404).json({
        message: "You are not the owner of this comment.",
        success: false,
      });
    }

    const commentToDelete = await Comment.findByIdAndDelete(commentId);

    if (!commentToDelete) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get Hotel Comments
const getHotelComments = async (req, res) => {
  try {
    let hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
        success: false,
      });
    }

    const currentPage = parseInt(req.query?.pageNumber || "1");
    const limit = parseInt(req.query?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const totalCountOfComments = await Comment.countDocuments({
      hotel: { _id: hotelId },
    });

    const totalPages = Math.ceil(totalCountOfComments / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const comments = await Comment.find({ hotel: { _id: hotelId } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .populate("user")
      .populate("hotel")
      .exec();

    res.status(201).json({
      message: "Comment Fetched Successfully!",
      result: comments,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCountOfComments,
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
  getAllHotel,
  getAllHotelByQuery,
  getOneHotel,
  getTopHotel,
  getHotelComments,
  addHotel,
  updateHotel,
  deleteHotel,
  addComment,
  updateComment,
  deleteComment,
};
