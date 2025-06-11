let express = require("express");
let app = express();
let cors = require("cors");
let mongoose = require("mongoose");
const connectDB = require("./configs/mongodb.js");
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("express app is running");
  console.log("express app is running");
});


module.exports = app;