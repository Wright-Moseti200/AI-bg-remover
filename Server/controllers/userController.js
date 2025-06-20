// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks

// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
const { Webhook } = require("svix");
const { userModel } = require("../models/userModel");

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                
                await userModel.create(userData);
                return res.status(200).json({ success: true });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name,
                    lastName: data.last_name, 
                    photo: data.image_url
                };
                
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                return res.status(200).json({ success: true });
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id });
                return res.status(200).json({ success: true });
            }

            default:
                return res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks };