let express = require("express");
let { clerkWebhooks } = require("../controllers/userController.js");
let userRouter = express.Router();

userRouter.get('/webhooks', clerkWebhooks);

module.exports = userRouter;