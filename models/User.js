import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    profileimage: { type: String },
    gender: { type: String, trim: true },
    age: { type: Number, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    tc: { type: Boolean, required: true }
});
// Model
const UserModel = mongoose.model("user", userSchema);
export default UserModel;