const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Ticket schema
const ticketSchema = new Schema({
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
    },
    orderid: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Ticket", ticketSchema);
