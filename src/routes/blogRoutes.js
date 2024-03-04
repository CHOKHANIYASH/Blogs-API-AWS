const router = require("express").Router();
const { isAdmin } = require("../middlewares/middlewares");
const { getAllBlogs, getBlog } = require("../controllers/blogsControllers");

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await getAllBlogs();
    res.status(200).send(response);
  } catch (err) {
    console.log("Error in getAllBlogs:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const response = await getBlog({ blogId });
    res.status(200).send(response);
  } catch (err) {
    console.log("Error in getAllBlogs:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

module.exports = router;
