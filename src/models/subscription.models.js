import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,    //who subscribes
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId,    //who is subscribed
        ref: "User",
    }
},
{timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);










/*
Aggregate pipelines - `18`:

to count subscribers of a user (channel), we will search for how many times that channel's name has occured or used in a document collection (subscriptions), and then we will just count those documents.
to count how many creators (channel) you have subscribed, we will search for documents that have your name (subscriber) and after finding those documents we will get the channel names in those documents and that's how we will know who you have subscribed.
*/