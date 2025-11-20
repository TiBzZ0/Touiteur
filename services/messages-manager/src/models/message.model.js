const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    readersId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account',
        default: []
    },
    content: {
        type: String,
        required: true
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;