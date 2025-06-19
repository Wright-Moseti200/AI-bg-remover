const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    creditBalance: { type: Number, default: 5 }
});

module.exports = mongoose.model('User', userSchema);

