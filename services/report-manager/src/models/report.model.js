const mongoose = require('mongoose');
const reportStatusEnum = require('./enums/reportStatus');
const reportReasonEnum = require('./enums/reportReason');

const reportSchema = new mongoose.Schema({
    touiteId: {
        type : String,
        required: true
    },
    posterId: {
        type : String,
        required: true
    },
    requesterId: {
        type : String,
        required: true
    },
    comment: {
        type : String,
        required: true
    },
    date: {
        type : Date,
        default: () => new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })),
        required: true
    },
    status: {
        type : String,
        enum: reportStatusEnum,
        default: 'reportStatusPending'
    },
    reason: {
        type : String,
        enum: reportReasonEnum,
        default: 'reportOther'
    },
    moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;