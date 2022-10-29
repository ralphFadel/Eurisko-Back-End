const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    noteBody: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tags: {
        type: [String],
        required: false //we can have notes without tags
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);