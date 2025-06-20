// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks

// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
import { verifyWebhook } from '@clerk/express/webhooks';
import User from '../models/userModel.js';

export const clerkWebhooks = async (req, res) => {
    try {
        // Verify the webhook using Clerk's built-in function
        const evt = await verifyWebhook(req);
        
        // Get the ID and type
        const { id } = evt.data;
        const eventType = evt.type;
        
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
        console.log('Webhook payload:', evt.data);

        // Handle the webhook based on event type
        switch (eventType) {
            case "user.created": {
                const userData = {
                    clerkId: evt.data.id,
                    email: evt.data.email_addresses[0]?.email_address,
                    firstName: evt.data.first_name,
                    lastName: evt.data.last_name,
                    photo: evt.data.image_url
                };
                
                await User.create(userData);
                console.log('User created in database:', userData.clerkId);
                break;
            }

            case "user.updated": {
                const userData = {
                    email: evt.data.email_addresses[0]?.email_address,
                    firstName: evt.data.first_name,
                    lastName: evt.data.last_name,
                    photo: evt.data.image_url
                };
                
                await User.findOneAndUpdate({ clerkId: evt.data.id }, userData);
                console.log('User updated in database:', evt.data.id);
                break;
            }

            case "user.deleted": {
                await User.findOneAndDelete({ clerkId: evt.data.id });
                console.log('User deleted from database:', evt.data.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${eventType}`);
                break;
        }

        return res.send('Webhook received');
        
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).send('Error verifying webhook');
    }
};

export default { clerkWebhooks };