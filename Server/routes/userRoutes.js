import express from 'express';
import bodyParser from 'body-parser';
import { clerkWebhooks } from '../controllers/userController.js';

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

export default userRouter;