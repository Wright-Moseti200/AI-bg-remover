// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
const { Webhook } = require('svix');
const userModel = require('../models/userModel');

const clerkWebhooks = async (req, res) => {
    try {
        console.log('Webhook received');
        
        // Verify webhook signature
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error('CLERK_WEBHOOK_SECRET is not set');
        }

        const webhook = new Webhook(WEBHOOK_SECRET);
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        };

        // Verify the webhook payload
        const payload = req.body;
        console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

        // The evt object contains { data, type }
        const evt = webhook.verify(JSON.stringify(payload), headers);
        console.log('Event type:', evt.type);

        switch (evt.type) {
            case 'user.created': {
                const { data } = evt;
                console.log('Creating new user:', data.id);

                // Extract email from the first email address in the array
                const primaryEmail = data.email_addresses?.[0]?.email_address;
                if (!primaryEmail) {
                    throw new Error('No email address found in user data');
                }

                const userData = {
                    clerkId: data.id,
                    email: primaryEmail,
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.image_url || data.profile_image_url || ''
                };

                console.log('Creating user with data:', userData);
                const newUser = await userModel.create(userData);
                console.log('User created successfully:', newUser);
                
                return res.status(201).json({ 
                    success: true, 
                    message: 'User created successfully',
                    user: newUser 
                });
            }

            case 'user.updated': {
                const { data } = evt;
                console.log('Updating user:', data.id);

                const primaryEmail = data.email_addresses?.[0]?.email_address;
                
                const userData = {
                    email: primaryEmail,
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.image_url || data.profile_image_url || ''
                };

                const updatedUser = await userModel.findOneAndUpdate(
                    { clerkId: data.id },
                    userData,
                    { new: true }
                );

                if (!updatedUser) {
                    console.log('User not found for update:', data.id);
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                console.log('User updated successfully:', updatedUser);
                return res.json({
                    success: true,
                    message: 'User updated successfully',
                    user: updatedUser
                });
            }

            case 'user.deleted': {
                const { data } = evt;
                console.log('Deleting user:', data.id);

                const deletedUser = await userModel.findOneAndDelete({ clerkId: data.id });
                
                if (!deletedUser) {
                    console.log('User not found for deletion:', data.id);
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                console.log('User deleted successfully');
                return res.json({
                    success: true,
                    message: 'User deleted successfully'
                });
            }

            default:
                console.log('Unhandled event type:', evt.type);
                return res.json({
                    success: true,
                    message: 'Unhandled event type'
                });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports =  clerkWebhooks ;