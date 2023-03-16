const router = require("express").Router();

const adminRoute = require("./admin_route");
const roomsRoute = require("./room_route");
const profileRoute = require("./profile_route");
const hotelRoute = require("./hotel_route");

router.use("/api", adminRoute);
router.use("/api", roomsRoute);
router.use("/api", profileRoute);
router.use("/api", hotelRoute);

module.exports = router;
