import { model, Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: [true, "Enter Name"] },
    email: { type: String, required: [true, "Enter Email"], unique: [true, "Email already exists"], validate: [(email) => { return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email); }, "Please enter a valid email"] },
    walletAddress: { type: String },
    imageUrl: { type: String },
    token: { type: String },
    concertsCreated: [{ type: Schema.Types.ObjectId, ref: 'Concert' }],
    concertsBought: [{ type: Schema.Types.ObjectId, ref: 'Concert' }],
});
const concertSchema = new Schema({
    name: { type: String, required: [true, "Enter Concert Name"] },
    date: { type: Date, required: [true, "Enter Concert Date"] },
    thumbnail: { type: String, required: [true, "Enter thumbnail"] },
    categories: [{ name: String, maxTickets: Number }],
    email: { type: String, required: [true, "Enter Email"], },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});
export const Concert = model("Concert", concertSchema);
export const User = model("User", userSchema);
