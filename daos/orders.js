const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Order schema
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);
