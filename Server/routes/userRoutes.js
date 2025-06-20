import express from 'express';
import bodyParser from 'body-parser';
import clerkWebhookHandler from '../controllers/userController.js';

const userRouter= express.Router();

// Clerk webhook endpoint with raw body parsing for svix
userRouter.post('/webhooks',clerkWebhookHandler);

export default userRouter;