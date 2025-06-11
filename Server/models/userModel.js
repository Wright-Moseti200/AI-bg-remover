let mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
clerkId: {type:String,required:true,unique:true},
email: {type:String, required:true,unique:true},
photo:{type:String,required:true},
firstName:{type:String},
lastName:{type:String},
creditBalance:{type:Number,default:5}
});

const userModel = mongoose.model("User",userSchema);

module.exports=userModel;