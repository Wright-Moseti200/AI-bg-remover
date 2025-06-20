let express = require("express");
let userRouter = express.Router();
 let clerkWebhooks = require("../controllers/userController.js");

 userRouter.post("/webhooks",clerkWebhooks);

 module.exports = userRouter;