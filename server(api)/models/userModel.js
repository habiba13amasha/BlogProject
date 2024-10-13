// models/userModel.js
import mongoose from "mongoose";

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// إنشاء نموذج المستخدم
const User = mongoose.model("User", userSchema);

export default User;
