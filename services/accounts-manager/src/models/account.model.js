const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/,
        validate: {
            validator: async function (value) {
                const account = await mongoose.models.Account.findOne({ username: value });
                return !account; // Ensure the username is unique
            },
            message: 'Username already exists'
        }
    },
    nickname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/
    },
    bio: {
        type: String,
        default: "",
        maxlength: 1024
    },
    pictureId: {
        type: String,
        default: ""
    },
    banned: {
        type: Date,
        default: null
    },
    deleted: {
        type: Date,
        default: null
    },
    themeId: {
        type: String,
        default: "1234567890abcdef12345678"
    },
    languageId: {
        type: String,
        default: "1234567890abcdef12345678"
    },
    notification: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastConnection: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 256,
        match: /^[a-zA-Z0-9_.@\-]+$/,
        validate: {
            validator: async function (value) {
                const auth = await mongoose.models.Account.findOne({ email: value });
                return !auth; // Ensure the email is unique
            },
            message: 'Email already exists'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    birthdate: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;