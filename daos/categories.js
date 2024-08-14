const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categoryType: {
        type: String,
        required: true,
        default: null,
    },
    level: {
        type: Number,
        required: true,
        default: 0,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    landingPageImage: {
        type: String,
        required: true,
    },
    thumbnailImage: {
        type: String,
        required: true,
    },
    gridImages: [{
        type: String,
    }],
    iconImage: {
        type: String,
    },
    backgroundImage: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
