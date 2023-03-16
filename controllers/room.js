const Room = require("../models/room");
const Hotel = require("../models/hotel");

// GET ALL ROOM
const getAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ index: 1 }).exec();

    return res.status(201).json({
      message: "Rooms fetched Successfully!",
      data: rooms,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET ROOMS BY QUERY (PAGINATION)
const getAllRoomByQuery = async (req, res) => {
  try {
    const currentPage = parseInt(req.query?.pageNumber || "1");
    const limit = parseInt(req.query?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const totalCountOfRooms = await Room.countDocuments({});

    const totalPages = Math.ceil(totalCountOfRooms / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    res.status(201).json({
      message: "Rooms Fetched Successfully!",
      result: rooms,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCountOfRooms,
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

// GET ROOMS BY HOTEL ID BY QUERY (PAGINATION)
const getRoomsByHotelID = async (req, res) => {
  try {
    const currentPage = parseInt(req.query?.pageNumber || "1");
    const limit = parseInt(req.query?.pageSize || "20");
    const skip = limit * (currentPage - 1);

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel with the ID not found",
        success: false,
      });
    }

    const totalCountOfRooms = await Room.countDocuments({
      hotel: { _id: req.params.hotelId },
    });

    const totalPages = Math.ceil(totalCountOfRooms / limit);
    const hasPrevious = currentPage > 1 && totalPages > 1;
    const hasNext = currentPage < totalPages;

    const rooms = await Room.find({
      hotel: { _id: req.params.hotelId },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    res.status(201).json({
      message: "Rooms Fetched Successfully!",
      result: rooms,
      currentPage,
      pageSize: limit,
      totalPages,
      totalCountOfRooms,
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

// GET A ROOM
const getOneRoom = async (req, res) => {
  try {
    let roomId = req.params.id;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Room Fetched Successfully!",
      data: room,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ADD A NEW ROOM
const addRoom = async (req, res) => {
  try {
    const lastRoom = await Room.find({ hotel: { _id: req.body.hotelId } })
      .sort({ index: -1 })
      .limit(1)
      .exec();
    const hotel = await Hotel.findById(req.body.hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel with the ID not found",
        success: false,
      });
    }

    const newRoom = new Room({
      capacity: req.body.capacity,
      price: req.body.price,
      assets: req.body.assets,
      index: lastRoom.length === 0 ? 1 : lastRoom[0]?.index + 1,
      createdBy: req.userId,
      hotel: req.body.hotelId,
    });

    await newRoom.save();
    return res.status(201).json({
      message: "Room added successfully",
      data: newRoom,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// UPDATE ROOM
const updateRoom = async (req, res) => {
  try {
    let roomId = req.params.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    const data = {
      capacity: req.body.capacity,
      price: req.body.price,
      assets: req.body.assets,
    };

    await Room.findByIdAndUpdate(roomId, data);

    return res.status(201).json({
      message: "Room updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// REMOVE A ROOM
const deleteRoom = async (req, res) => {
  try {
    let roomId = req.params.id;
    const roomToDelete = await Room.findByIdAndDelete(roomId);

    if (!roomToDelete) {
      return res.status(404).json({
        message: "Room not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Room deleted successfully",
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
  getAllRoom,
  getAllRoomByQuery,
  getRoomsByHotelID,
  getOneRoom,
  addRoom,
  updateRoom,
  deleteRoom,
};
