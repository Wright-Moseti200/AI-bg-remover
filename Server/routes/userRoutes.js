let express = require("express");
let userRouter = express.Router();
let {clerkWebhooks} = require("../controllers/userController.js");
import { clerkMiddleware } from '@clerk/express';




userRouter.use(clerkMiddleware());
 userRouter.post("/webhooks",clerkWebhooks);

 module.exports = {userRouter};