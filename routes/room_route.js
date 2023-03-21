const router = require("express").Router();
const { auth, isAdmin } = require("../middlewares/auth-middleware");
const {
  getAllRoom,
  getAllRoomByQuery,
  getRoomsByHotelID,
  getOneRoom,
  addRoom,
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
