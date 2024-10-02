import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: [true, "Enter Name"] },
    email: { type: String, required: [true, "Enter Email"], unique: [true, "Email already exists"], validate: [(email: string) => { return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email) }, "Please enter a valid email"] },
    walletAddress: { type: String },
    imageUrl: { type: String },
    token: { type: String },
})

export const User = model("User", userSchema);