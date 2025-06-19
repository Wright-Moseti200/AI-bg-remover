// API Controller Function to Manage Clerk User with database
// http://localhost:4000/api/user/webhooks
let {Webhook}=require("svix");
const userModel = require("../models/userModel");

const clerkWebhooks = async (req,res)=>{
    try{
        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        });

        const {data,type}= req.body;

        switch (type){
            case "user.created":{
                const userData = {
                    clerkId:data.id,
                    email:data.email_addresses[0].email_address,
                    firstName:data.firstName,
                    latName:data.lastName,
                    photo:data.image_url
                }
                await userModel.create(userData);
                res.json({});
            break;
            }

            case "user.updated":{
                 const userData = {
                    email:data.email_addresses[0].email_address,
                    firstName:data.firstName,
                    latName:data.lastName,
                    photo:data.image_url
                }
                await userModel.findByIdAndUpdate({clerkId:data.id},userData);
            break;
            }

            case "user.deleted":{
                await userModel.findOneAndDelete({clerkId:data.id});
                res.json({})
            break;
            }

            default:
                break;
        }
    }
    catch (error){
        console.log(error.message);

    }
}

module.exports=clerkWebhooks;