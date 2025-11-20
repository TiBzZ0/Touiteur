const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    touiteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Touite'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Like = mongoose.model('Like', likesSchema);

module.exports = Like;