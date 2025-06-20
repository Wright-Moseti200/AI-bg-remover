let mongoose = require("mongoose");

const connectDB = ()=>{
    mongoose.connect(`${process.env.MONGODB_URI}/bguserdatabse`);
    console.log("Database connected");
}

module.exports = { connectDB };
