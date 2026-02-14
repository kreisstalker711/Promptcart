// Prompt Model Schema
// This is a placeholder structure for MongoDB integration using Mongoose
// Uncomment and use this when you're ready to integrate MongoDB

/*
const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    category: {
        type: String,
        required: true,
        enum: ['writing', 'coding', 'marketing', 'study', 'other'],
        lowercase: true
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function(arr) {
                return arr.length <= 10;
            },
            message: 'Maximum 10 tags allowed'
        }
    },
    author: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    upvotes: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
promptSchema.index({ category: 1 });
promptSchema.index({ upvotes: -1 });
promptSchema.index({ createdAt: -1 });
promptSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Prompt', promptSchema);
*/

// For now, export a simple structure
module.exports = {
    schema: {
        title: String,
        description: String,
        category: String,
        tags: Array,
        author: String,
        content: String,
        upvotes: Number,
        createdAt: Date
    }
};