// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks

const { Webhook } = require('svix');
const User = require('../models/userModel');

const clerkWebhooks = async (req, res) => {
    try {
        // Get the headers and body
        const svix_id = req.headers["svix-id"];
        const svix_timestamp = req.headers["svix-timestamp"];
        const svix_signature = req.headers["svix-signature"];

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Error occurred -- no svix headers' 
            });
        }

        // Get the body
        const body = JSON.stringify(req.body);

        // Create a new Svix instance with your webhook secret
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        let evt;
        // Verify the payload with the headers
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return res.status(400).json({ 
                success: false, 
                message: 'Error verifying webhook' 
            });
        }

        // Get the ID and type
        const { id } = evt.data;
        const eventType = evt.type;

        console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

        // Handle the webhook
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

        return res.status(200).json({ success: true, message: 'Webhook received' });
        
    } catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Fix export syntax for ES modules
module.exports = { clerkWebhooks };