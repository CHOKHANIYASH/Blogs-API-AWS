const router = require("express").Router();
const {
  signUp,
  login,
  getAllUsers,
} = require("../controllers/userControllers");
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

module.exports = router;
