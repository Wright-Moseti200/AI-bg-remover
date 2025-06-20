let mongoose = require("mongoose");

const connectDB = ()=>{
     mongoose.connect(`${process.env.MONGODB_URI}/bg`);
    console.log("Database connected");
}

module.exports = { connectDB };
