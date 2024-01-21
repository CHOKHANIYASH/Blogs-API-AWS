require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const userRoutes = require("./routes/userRoutes");
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening at port:${PORT}`);
});
