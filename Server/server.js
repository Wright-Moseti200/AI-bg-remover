let express = require("express");
let app = express();
let cors = require("cors");
let mongoose = require("mongoose");
const connectDB = require("./configs/mongodb.js");
require("dotenv").config();
connectDB(); 
let userRouter = require("./routes/userRoutes");

let PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("express app is running");
  console.log("express app is running");
});

app.use("/api/user",userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});