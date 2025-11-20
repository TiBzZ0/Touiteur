const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;