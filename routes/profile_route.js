const router = require("express").Router();
const { auth } = require("../middlewares/auth-middleware");
const {
  getOneUser,
  updateUser,
  subscribe,
  unSubscribe,
  sendContact,
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetUserPassword,
  changeUserPassword,
} = require("../controllers/user-profile");

const { getUserBookings } = require("../controllers/room");

const {
  updateUserValidate,
  updateUserValidation,
} = require("../validations/user");

const { userValidation, userValidate } = require("../validations/user");
const {
  passwordValidate,
  passwordValidation,
  resetPasswordValidate,
  resetPasswordValidation,
} = require("../validations/password");

// register a user
router.post("/register", userValidation(), userValidate, async (req, res) => {
  await registerUser(req.body, res);
});

// LOGIN A USER
router.post("/login", async (req, res) => {
  await loginUser(req.body, res);
});

// VERIFY A USER
router.post("/verify-user", async (req, res) => {
  await verifyEmail(req.body, res);
});

// FORGOT PASSWORD FOR A USER
router.post("/forgot-password", async (req, res) => {
  await forgotPassword(req.body, res);
});

// RESET PASSWORD FOR A USER
router.post(
  "/reset-password",
  passwordValidation(),
  passwordValidate,
  async (req, res) => {
    await resetUserPassword(req.body, res);
  }
);

// CHANGE PASSWORD FOR A USER
router.post(
  "/change-password",
  resetPasswordValidation(),
  resetPasswordValidate,
  async (req, res) => {
    await changeUserPassword(req.body, req, res);
  }
);

// GET A USER PROFILE
router.get("/user-profile", auth, async (req, res) => {
  await getOneUser(req, res);
});

// UPDATE A USER PROFILE
router.put(
  "/user-profile/:id",
  auth,
  updateUserValidation(),
  updateUserValidate,
  async (req, res) => {
    await updateUser(req, res);
  }
);

// Get user booking
router.get("/user-booking", auth, async (req, res) => {
  await getUserBookings(req, res);
});

router.post("/subscribe", async (req, res) => {
  await subscribe(req, res);
});

router.delete("/unsubscribe", async (req, res) => {
  await unSubscribe(req, res);
});

router.post("/send-contact-form", async (req, res) => {
  await sendContact(req, res);
});

module.exports = router;
