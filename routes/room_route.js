const router = require("express").Router();
const { auth, isAdmin } = require("../middlewares/auth-middleware");
const {
  getAllRoom,
  getAllRoomByQuery,
  getRoomsByHotelID,
  getOneRoom,
  addRoom,
  checkForAvailability,
  bookARoom,
  bookMultipleRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room");

const {
  roomValidate,
  roomValidation,
  updateRoomValidation,
} = require("../validations/room");

// GET ALL ROOM
router.get("/rooms/all", async (req, res) => {
  await getAllRoom(req, res);
});

// GET ROOM BY HOTEL ID
router.get("/rooms/hotel/:hotelId", async (req, res) => {
  await getRoomsByHotelID(req, res);
});

// GET ALL ROOM BY QUERY
router.get("/rooms", async (req, res) => {
  await getAllRoomByQuery(req, res);
});

// GET A ROOM
router.get("/rooms/:id", async (req, res) => {
  await getOneRoom(req, res);
});

// ADD ONE ROOM
router.post(
  "/rooms",
  auth,
  isAdmin,
  roomValidation(),
  roomValidate,
  async (req, res) => {
    await addRoom(req, res);
  }
);

// Check for room availability
router.post("/rooms/booking/available", async (req, res) => {
  await checkForAvailability(req, res);
});

// Book a room
router.post("/rooms/booking", auth, async (req, res) => {
  await bookARoom(req, res);
});

// Book multiple room
router.post("/rooms/booking/multiple", auth, async (req, res) => {
  await bookMultipleRoom(req, res);
});

// UPDATE A ROOM
router.put(
  "/rooms/:id",
  updateRoomValidation(),
  roomValidate,
  async (req, res) => {
    await updateRoom(req, res);
  }
);

// DELETE A ROOM
router.delete("/rooms/:id", async (req, res) => {
  await deleteRoom(req, res);
});

module.exports = router;
