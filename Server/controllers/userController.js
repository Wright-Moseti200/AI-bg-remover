// Clerk Webhook Controller (ESM + correct Clerk field names)
import { Webhook } from 'svix';
import User from '../models/userModel.js';

// Handles Clerk webhooks for user creation, update, and deletion
export default async function clerkWebhookHandler(req, res) {
  try {
    // Verify webhook signature using Svix
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    wh.verify(req.rawBody, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });

    const { type, data } = req.body;

    if (type === 'user.created') {
      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name,   // snake_case
        lastName: data.last_name,     // snake_case
        photo: data.image_url,
      });
      return res.status(200).json({ success: true, message: 'User created' });
    }

    if (type === 'user.updated') {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        }
      );
      return res.status(200).json({ success: true, message: 'User updated' });
    }

    if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id });
      return res.status(200).json({ success: true, message: 'User deleted' });
    }

    // For other event types, just acknowledge
    return res.status(200).json({ success: true, message: 'Event ignored' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}