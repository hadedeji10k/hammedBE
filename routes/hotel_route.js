const router = require("express").Router();
const { auth, isAdmin } = require("../middlewares/auth-middleware");
const {
  getAllHotel,
  getAllHotelByQuery,
  getTopHotel,
  getOneHotel,
  addHotel,
  updateHotel,
  deleteHotel,
  addComment,
  updateComment,
  deleteComment,
  getHotelComments,
} = require("../controllers/hotel");

const {
  hotelValidate,
  hotelValidation,
  commentValidation,
  commentValidate,
} = require("../validations/room");

// GET ALL HOTEL
router.get("/hotels/all", async (req, res) => {
  await getAllHotel(req, res);
});

// GET ALL HOTEL BY QUERY
router.get("/hotels", async (req, res) => {
  await getAllHotelByQuery(req, res);
});

// GET TOP HOTELS
router.get("/hotels/top", async (req, res) => {
  await getTopHotel(req, res);
});

// GET A HOTEL
router.get("/hotels/:id", async (req, res) => {
  await getOneHotel(req, res);
});

// ADD ONE HOTEL
// , , isAuthourized(["admin"]),
router.post(
  "/hotels",
  auth,
  isAdmin,
  hotelValidation(),
  hotelValidate,
  async (req, res) => {
    await addHotel(req, res);
  }
);

// UPDATE A HOTEL
// , isAuthourized(["admin"]),
router.put(
  "/hotels/:id",
  hotelValidation(),
  hotelValidate,
  async (req, res) => {
    await updateHotel(req, res);
  }
);

// DELETE A HOTEL
router.delete("/hotels/:id", async (req, res) => {
  await deleteHotel(req, res);
});

// ADD COMMENT
// , ,
router.post(
  "/comments",
  auth,
  commentValidation(),
  commentValidate,
  async (req, res, next) => {
    await addComment(req, res);
  }
);

// UPDATE A COMMENT
// , ,
router.put(
  "/comments/:id",
  auth,
  commentValidation(),
  commentValidate,
  async (req, res) => {
    await updateComment(req, res);
  }
);

// DELETE A COMMENT
// ,
router.delete("/comments/:commentId", auth, async (req, res) => {
  await deleteComment(req, res);
});

// GET HOTEL COMMENTS
router.get("/comments/hotel/:hotelId", async (req, res) => {
  await getHotelComments(req, res);
});

module.exports = router;
