const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    iterations: {
        type: Number,
        required: true,
    },
    token: String,
    expire_at: Number,
    is_admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
