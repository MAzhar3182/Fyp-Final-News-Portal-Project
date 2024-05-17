import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    profileimage: {
        data: Buffer,
        contentType: String,
    },
    gender: { type: String, trim: true }, // Make gender optional
    age: { type: Number, trim: true }, // Make age optional
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
       tc: { type: Boolean, required: true },
       role: { type: Schema.Types.ObjectId, ref: 'Role' }
});
// Model
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
