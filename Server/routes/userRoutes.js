const express = require('express');
const bodyParser = require('body-parser');
const { clerkWebhooks } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post(
  '/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
  },
  clerkWebhooks
);

module.exports = { userRouter };