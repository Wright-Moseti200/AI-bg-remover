// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook received");
        
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET is missing");
        }

        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        // Verify webhook
        const payload = req.body;
        const headerPayload = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };
        
        if (!headerPayload["svix-id"] || !headerPayload["svix-timestamp"] || !headerPayload["svix-signature"]) {
            throw new Error("Missing required headers");
        }

        const evt = await whook.verify(JSON.stringify(payload), headerPayload);
        console.log("Event type:", evt.type);
        console.log("Event data:", evt.data);

        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    photo: data.image_url || data.profile_image_url || ""
                };
                console.log("Creating user:", userData);
                const newUser = await userModel.create(userData);
                console.log("User created:", newUser);
                return res.status(201).json({ success: true, user: newUser });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    photo: data.image_url || data.profile_image_url || ""
                };
                console.log("Updating user:", data.id, userData);
                const updatedUser = await userModel.findOneAndUpdate(
                    { clerkId: data.id },
                    userData,
                    { new: true }
                );
                console.log("User updated:", updatedUser);
                return res.json({ success: true, user: updatedUser });
            }

            case "user.deleted": {
                console.log("Deleting user:", data.id);
                await userModel.findOneAndDelete({ clerkId: data.id });
                return res.json({ success: true, message: "User deleted" });
            }

            default:
                console.log("Unhandled event type:", type);
                return res.json({ success: true, message: "Unhandled event type" });
        }
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export default clerkWebhooks;