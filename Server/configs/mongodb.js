let mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(`${process.env.MONGODB_URI}/bg`);  
    console.log("Database connected");
}

module.exports=connectDB;