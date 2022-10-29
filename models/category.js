const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catgeorySchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
});

module.exports = mongoose.model('Category', catgeorySchema);