const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    public_id: {
        type: String,
        required: true,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    roomCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: function() {
            return this.furnitureCategory == null;
        }
    },
    furnitureCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: function() {
            return this.roomCategory == null;
        }
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: function() {
            return this.roomCategory == null;
        }
    },
    imageUrl: {
        type: [String],
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    dimensions: {
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        depth: {
            type: Number,
        },
    },
    material: {
        type: [String],
    },
    color: {
        type: [String],
    },
    tags: [String],
    modelUrl: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);
