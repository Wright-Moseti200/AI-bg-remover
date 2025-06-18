let express = require("express");
import {clerkWebhooks} from "../controllers/userController.js"
let userRouter = express.Router();


userRouter.post('/webhooks',clerkWebhooks);

module.exports=userRouter;