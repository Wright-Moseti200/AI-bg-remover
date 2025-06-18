let mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database Connected");
    });
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;