// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
let {Webhook}=require("svix");
const userModel = require("../models/userModel");

const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // Use rawBody for svix verification
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
                    firstName: data.firstName,
                    lastName: data.lastName,
                    photo: data.image_url
                };
                await userModel.create(userData);
                res.status(200).json({ success: true });
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    photo: data.image_url
                };
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                res.status(200).json({ success: true });
                break;
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id });
                res.status(200).json({ success: true });
                break;
            }

            default:
                res.status(200).json({});
                break;
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

module.exports = clerkWebhooks;