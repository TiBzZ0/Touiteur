const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    usersId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account',
        default: []
    },
    lastMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Date,
        default: null
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;