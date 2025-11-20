const mongoose = require('mongoose');

const filesSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const File = mongoose.model('File', filesSchema);

module.exports = File;