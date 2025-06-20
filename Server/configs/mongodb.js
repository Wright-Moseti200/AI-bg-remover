let mongoose = require("mongoose");

const connectDB = ()=>{
    mongoose.connect(`${process.env.MONGODB_URI}/bguser`);
    console.log("Database connected");
}

module.exports = { connectDB };
