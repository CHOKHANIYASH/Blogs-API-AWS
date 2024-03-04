require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const resizeHandler = require("./handlers/s3Handler");
// const { client, addData } = require("./controllers/redisControllers");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
console.log("Server running");
app.get("/", (req, res) => {
  res.send("Welcome To Blogistaan API");
});
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

module.exports.handler = serverless(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
