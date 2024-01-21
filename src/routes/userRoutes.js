const router = require("express").Router();
const { signUp, login } = require("../controllers/userControllers");

router.get("/", (req, res) => {
  res.send("Welcome");
});
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const response = await signUp(username, password, email);
  res.send(response);
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const response = await login(username, password);
  res.send(response);
});

module.exports = router;
