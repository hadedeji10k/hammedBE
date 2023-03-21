const router = require("express").Router();
const { auth, isAdmin } = require("../middlewares/auth-middleware");
const { registerAdmin } = require("../controllers/user-profile");
const { adminDashboard, getBookings } = require("../controllers/admin");
const { userValidate, userValidation } = require("../validations/user");

// Fetch admin dashboard
router.get("/admin/dashboard", auth, isAdmin, async (req, res) => {
  await adminDashboard(req, res);
});

// Get bookings
router.get("/admin/bookings", auth, isAdmin, async (req, res) => {
  await getBookings(req, res);
});

// REGISTER A ADMIN
router.post(
  "/admin-register",
  userValidation(),
  userValidate,
  async (req, res) => {
    await registerAdmin(req.body, res);
  }
);

module.exports = router;
