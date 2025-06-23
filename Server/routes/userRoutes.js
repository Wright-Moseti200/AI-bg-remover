let express = require("express");
let userRouter = express.Router();
 let {clerkWebhooks, userCredits} = require("../controllers/userController");
const { authUser } = require("../middlewares/auth");

userRouter.post("/webhooks",clerkWebhooks);
userRouter.get("/credits",authUser,userCredits);
module.exports = {userRouter};