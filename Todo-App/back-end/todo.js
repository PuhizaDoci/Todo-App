const mongoose = require('mongoose');
const Todoschema = new mongoose.Schema({
    todoid: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: false,
    },
    done: {
        type: Boolean,
        default: false,
    },
    subtask: {
        subtaskId: {
            type: Number,
            required: false
        },
        title: {
          type: String,
            required: false
        },
        description: {
          type: String,
          required: false
        },
        parentId: {
          type: Number,
          required: false
        },
        done: {
            type: Boolean,
            default: false,
        },
    },
    parentid: {
        type: Number,
        required: false,
    },
    userid: {
        type: Number,
        required: true,
    },
    lastModified: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.models['Todo_'] || mongoose.model("Todo_", Todoschema);