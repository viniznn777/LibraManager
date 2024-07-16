const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8081;
require("dotenv").config({ path: "./.env" });

const authRoutes = require("./src/config/routes/authRoutes");
const registerBookRoutes = require("./src/config/routes/registerBookRoutes");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/api", registerBookRoutes);

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.listen(PORT, () =>
  console.log(`Server started succesfully. HTTP://LOCALHOST:${PORT}`)
);
