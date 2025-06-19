let express = require("express");
let userRouter = express.Router();
let clerkWebhooks = require("../controllers/userController");

// Add raw body parser for Clerk webhooks
const bodyParser = require('body-parser');
userRouter.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    // Save raw body for svix verification
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next();
  },
  clerkWebhooks
);

module.exports = userRouter;