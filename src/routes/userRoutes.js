const router = require("express").Router();
const {
  signUp,
  login,
  getAllUsers,
  subscribers,
  subscribe,
} = require("../controllers/userControllers");
const { addBlog, getUserBlogs } = require("../controllers/blogsControllers");

const { isAdmin } = require("../middlewares/middlewares");

router.get("/", isAdmin, async (req, res) => {
  try {
    const response = await getAllUsers();
    res.status(200).send(response);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} }); // 500 status code for internal server error
  }
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const response = await signUp({ username, password, email });
    res.status(201).send(response); // 201 status code for resource created
  } catch (error) {
    console.error("Error in signUp:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} }); // 500 status code for internal server error
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await login({ username, password });
    res.status(200).send(response); // 200 status code for success
  } catch (err) {
    console.error("Error in login:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

router.get("/:id/blog", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await getUserBlogs({ userId });
    res.status(200).send(response);
  } catch (err) {
    console.error("Error in getUserBlog:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

router.post("/:id/blog", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await addBlog({
      blogData: req.body,
      userId: id,
    });
    res.status(200).send(response);
  } catch (err) {
    console.error("Error in getUserBlogs:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

router.get("/:id/subscribers", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await subscribers({ userId });
    res.status(200).send(response);
  } catch (err) {
    console.error("Error in getting all the subscribers:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

router.post("/:id/subscribe", async (req, res) => {
  try {
    const userId = req.params.id;
    const email = req.body.email;
    const response = await subscribe({
      userId,
      email,
    });
    res.status(200).send(response);
  } catch (err) {
    console.error("Error in subscribing:", err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Error", data: {} });
  }
});

module.exports = router;
