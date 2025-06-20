// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks

import { Webhook } from 'svix';
import User from '../models/userModel.js';

export const clerkWebhooks = async (req, res) => {
    try {
        // Use rawBody for Svix verification
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(req.rawBody, {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await User.create(userData);
                res.json({});
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await User.findOneAndUpdate({ clerkId: data.id }, userData);
                res.json({});
                break;
            }
            case 'user.deleted': {
                console.log('Deleting user with clerkId:', data.id);
                const deleted = await User.findOneAndDelete({ clerkId: data.id });
                console.log('Deleted user:', deleted);
                res.json({});
                break;
            }
            default:
                res.json({});
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const userData = await User.findOne({ clerkId });
        res.json({ success: true, credits: userData.creditBalance });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};