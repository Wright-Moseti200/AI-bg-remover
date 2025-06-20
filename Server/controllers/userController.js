// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
const { Webhook } = require('svix');
const User = require('../models/userModel');

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(req.rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
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

            case "user.updated": {
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

            case "user.deleted": {
                await User.findOneAndDelete({ clerkId: data.id });
                res.json({});
                break;
            }

            default:
                res.json({});
                break;
        }
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks };