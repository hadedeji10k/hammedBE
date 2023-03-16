const router = require("express").Router();
const { isAuthourized } = require("../middlewares/auth-middleware");
const { registerAdmin } = require("../controllers/user-profile");
const {
  getAllUser,
  getAllUserByQuery,
  getOneUser,
  adminDashboard,
  getOneUserWithoutPopulating,
} = require("../controllers/admin");
const { userValidate, userValidation } = require("../validations/user");

// GET ALL USERS
/*
    #swagger.tags = ['Admin]
    #swagger.security = [{
        "Authorization" : []
    }]
*/
// , isAuthourized(["admin"]),
router.get("/admin-users/all", async (req, res) => {
  await getAllUser(req, res);
});

// GET ALL USERS BY QUERY
router.get("/admin-users", isAuthourized(["admin"]), async (req, res) => {
  await getAllUserByQuery(req, res);
});

// GET ONE (A) USER
// , , isAuthourized(["admin"])
router.get("/admin-users/:id", async (req, res) => {
  await getOneUser(req, res);
});
router.get("/admin-users/aUser/:id", async (req, res) => {
  await getOneUserWithoutPopulating(req, res);
});

// Fetch admin dashboard
// , isAuthourized(["admin"]),
router.get("/admin-users/admin/dashboard", async (req, res) => {
  await adminDashboard(req, res);
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
