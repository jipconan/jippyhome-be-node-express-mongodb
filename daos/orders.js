const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userOrdersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderIds: {
        type: [String], 
        default: [],  
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("UserOrder", userOrdersSchema);
